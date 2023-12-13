import {getLoginRoute, getSessionRoute, removeToken, setToken} from "../../public/js/api.config.js";

window.addEventListener("load", () => {
    document.getElementById("login").addEventListener("submit", ev => {
        ev.preventDefault();
        let username = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let remember = document.getElementById("remember").checked;
        let data = {
            username: username,
            password: password
        };

        let config
        if (remember === true) {
            config = {
                "remember_me": true
            }
        } else {
            config = {
                "remember_me": false
            }
        }

        let auth = btoa(username + ":" + password);

        fetch(getLoginRoute(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + auth
            },
            body: JSON.stringify(config),
        }).then(response => response.json())
            .then(data => {
                console.log(data);
                document.getElementById("token").innerText = data;
                setToken(data, remember);
                fetch(getSessionRoute(), {
                    method: "GET",
                    contentType: "application/json",
                    headers: {
                        'Authorization': 'Bearer ' + data,
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        document.getElementById("user").innerText = JSON.stringify(data);
                    })
                    .catch(error => console.log(error));
            })
            .catch(error => console.log(error));
    });

    document.getElementById("remove_token").onclick = function () {
        removeToken();
    }
});