import {getLoginRoute, setToken} from "../api.config.js";

window.addEventListener("load", () => {
    document.getElementById("login").addEventListener("submit", ev => {
        ev.preventDefault();
        let remember = document.getElementById("remember").checked;
        let data = {
            username: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        let config;
        if (remember === true) {
            config = {
                "remember_me": true
            }
        } else {
            config = {
                "remember_me": false
            }
        }

        let auth = btoa(data.username + ":" + data.password);

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
                setToken(data.access_token, remember);
                if (data.user.type === "Admin") {
                    window.location.href = "../manager";
                } else if (data.user.type === "Employee") {
                    window.location.href = "../employee";
                }
                window.location.href = "../user";
            })
            .catch(error => console.log(error));
    });
});