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

    let name= document.getElementById('nombre')
    let description= document.getElementById('descr')
    let price= document.getElementById('precio')
    let stock= document.getElementById('cantidad')

    fetch(getProductRoute(product))
        .then(response => response.json)
        .then(data =>{

            console.log()
            
            name.innerHTML = data.name
            description.innerHTML = data.description
            price.innerHTML = data.price
            stock.innerHTML = data.stock

        })
        .catch(err => console.log(err))
});