import {getProductRoute, getToken, getUserRoute, log, removeToken} from "../../src/public/js/api.config.js";

window.addEventListener("load", () => {
    document.getElementById("load").addEventListener("submit", ev => {
        ev.preventDefault();
        if (getToken() === null) {
            alert("Please enter a token");
            window.location.href = "login.employee";
        }

        let time = 70;

        // Load products
        fetch("./data/products.json")
            .then(response => response.json())
            .then(data => {
                data.forEach((product, index) => {
                    setTimeout(() => {
                        fetch(getProductRoute(), {
                            method: "POST",
                            body: JSON.stringify(product),
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + getToken()
                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                log(data.name + " added");
                            })
                    }, index * time);
                });
            });

        // Load users
        fetch("./data/users.json")
            .then(response => response.json())
            .then(data => {
                data.forEach((user, index) => {
                    setTimeout(() => {
                        fetch(getUserRoute(), {
                            method: "POST",
                            body: JSON.stringify(user),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                log(data.name + " added");
                            })
                    }, index * time);
                });
            });
        document.getElementById("remove_token").onclick = function () {
            removeToken();
        }
    });
});