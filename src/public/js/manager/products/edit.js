import {
    getToken,
    getUserRoute,
    getImageRoute,
    getUserSearchRoute,
    getProductRoute
} from "../../api.config.js";

window.addEventListener('load', ev => {
    let urlParams = new URLSearchParams(window.location.search);
    let product = urlParams.get('id');
    if (product == null) {
        window.location.href = 'index.html';
    }

    let name = document.getElementById('nombre');
    let description = document.getElementById('descr');
    let price = document.getElementById('precio');
    let stock = document.getElementById('cantidad');

    fetch(getProductRoute(product))
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // Asignar valores a los campos de entrada
            name.value = data.name;
            description.value = data.description;
            price.value = data.price;
            stock.value = data.stock;
        })
        .catch(err => console.log(err));
});
