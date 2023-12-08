import { url } from "../../api.config.js";

let imageproduct="";

window.addEventListener("load", function () {
    document.getElementById("file").onchange = function () {
        let imag = document.getElementById("file").files[0];
        let blob = new Blob([imag], { type: imag.type });
        let reader = new FileReader();
        reader.readAsDataURL(imag);
        reader.onloadend = function () {
            let image = {
                image: reader.result
            }
            return fetch(url + "/images", {
                method: 'POST',
                body: JSON.stringify(image),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    let img_url = url + "/images/" + data.id;
                    imageproduct = data.id;
                    console.log(imageproduct);
                    document.getElementById("uuid").innerText = data.id;
                    document.getElementById("hash").innerText = data.hash;
                    document.getElementById("url").innerText = img_url;
                    document.getElementById("img").src = img_url;
                })
                .catch(error => console.error('Error al enviar datos:', error));
        }
    }

    document.getElementById("crud-form").addEventListener('submit', () => {
        let name = document.getElementById("name").value;
        let description = document.getElementById("description").value;
        let price = document.getElementById("price").value;
        let stock = document.getElementById("stock").value;
        let image = imageproduct;
        console.log(image);

        let product = {};

        if (image !== "") {
            product = {
                name: name,
                description: description,
                price: parseFloat(price),
                stock: parseInt(stock),
                image: image
            };
        } else {
            product = {
                name: name,
                description: description,
                price: parseFloat(price),
                stock: parseInt(stock)
            };
        }
        console.log(product);
        fetch(url + "/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        }).then(response => response.json())
            .then(product => alert("Product created with id: " + product.id));
    });

});
