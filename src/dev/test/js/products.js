import {getImageRoute, getProductRoute, getToken, getURL, removeToken} from "../../../public/js/api.config.js";

window.addEventListener("load", () => {
    document.getElementById("new-product").addEventListener('submit', () => {
        let name = document.getElementById("name").value;
        let description = document.getElementById("description").value;
        let price = document.getElementById("price").value;
        let stock = document.getElementById("stock").value;
        let image = document.getElementById("image").value;

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
        fetch(getURL() + "/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getToken()
            },
            body: JSON.stringify(product)
        }).then(response => response.json())
            .then(product => alert("Product created with id: " + product.id));
    });

    fetch(getProductRoute(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response) {
        return response.json();
    }).then(data => {
        let tbody = document.createElement("tbody")
        data.forEach(product => {
                let row = document.createElement("tr");
                let id = document.createElement("td");
                id.innerText = product.id;
                row.appendChild(id);
                let name = document.createElement("td");
                name.innerText = product.name;
                row.appendChild(name);
                let description = document.createElement("td");
                description.innerText = product.description;
                row.appendChild(description);
                let price = document.createElement("td");
                price.innerText = product.price;
                row.appendChild(price);
                let stock = document.createElement("td");
                stock.innerText = product.stock;
                row.appendChild(stock);
                let image = document.createElement("td");
                if (product.image_id !== null) {
                    image.innerText = getImageRoute(product.image_id);
                } else {
                    image.innerText = "No image";
                }
                row.appendChild(image);
                tbody.appendChild(row);
            }
        )
        document.getElementById("table").appendChild(tbody);

    });
    document.getElementById("remove_token").onclick = function () {
        removeToken();
    }
});