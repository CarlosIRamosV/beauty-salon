import { getLoginRoute, getUsersRoute, setToken, getToken } from "./api.config.js";

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

        fetch(getUsersRoute(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken(),
            },
            body: JSON.stringify({})
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.type === "Admin") {
                    //ADMIN DE LA GRASA
                    window.location.href = "../../manager/citas/index.html";
                } else if (data.type === "User") {
                    //Usuario
                    window.location.href = "../../Usuario/html/menuInicio.html";
                } else if (data.type === "Employee") {
                    // Empleado
                    window.location.href = "../../Empleados/html/menuInicio.html";
                } else {
                    alert("cabeson")
                }
            }
            )
            .catch(err => console.log(err));

    });

});