import {getLoginRoute, removeToken, setToken} from "./api.config.js";

window.addEventListener("load", () => {
    document.getElementById("login").addEventListener("submit", () => {
        event.preventDefault();
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
                setToken(data, remember);
            })
            .catch(error => console.log(error));
    });

});