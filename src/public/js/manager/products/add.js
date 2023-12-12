import {getImageRoute, getProductRoute, getToken} from "../../api.config.js";
import {validate} from "../lib.js";

validate(true);
window.addEventListener("load", () => {
    document.getElementById("crud-form").addEventListener('submit', (ev) => {
        ev.preventDefault();
        let name = document.getElementById("name").value;
        let description = document.getElementById("description").value;
        let price = document.getElementById("price").value;
        let stock = document.getElementById("stock").value;
        let imag = document.getElementById("file").files[0];
        let blob = new Blob([imag], {type: imag.type});
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            let image = {
                image: reader.result
            }
            return fetch(getImageRoute(), {
                method: 'POST',
                body: JSON.stringify(image),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                }
            })
                .then(response => response.json())
                .then(data => {
                    let product = {
                        name: name,
                        description: description,
                        price: parseFloat(price),
                        stock: parseInt(stock),
                        image: data.id
                    };
                    fetch(getProductRoute(), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': 'Bearer ' + getToken()
                        },
                        body: JSON.stringify(product)
                    }).then(response => response.json())
                        .then(product => alert("Product created with id: " + product.id));
                })
                .catch(error => console.error('Error al enviar datos:', error));
        }
    });
});
