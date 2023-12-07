import {url} from "./api.config.js";

/**
 * Obtener todos los productos
 * @returns lista de productos
 */
function getProductos() {
    return fetch(url + "/products")
        .then(response => response.json())
        .catch(error => console.error('Error al enviar datos:', error));
}

/**
 * Obtener un producto por ID
 * @param id id del producto
 * @returns {Promise<Response | never>} producto
 */
function getProducto(id) {
    return fetch(url + "/products/" + id)
        .then(response => response.json())
        .catch(error => console.error('Error al enviar datos:', error));
}

/**
 * Registrar un producto
 * @param name nombre del producto
 * @param description descripción del producto
 * @param price precio del producto
 * @param stock stock del producto
 * @param imag imagen del producto
 * @returns {Promise<Response | never>} producto registrado
 */
async function addProducto(name, description, price, stock, imag) {
    let blob = new Blob([imag], {type: imag.type});
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
        fetch(url + "/image", {
            method: 'POST',
            body: JSON.stringify('image', reader.result),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                let producto = {
                    name: name,
                    description: description,
                    price: price,
                    quantity: stock,
                    image_id: response.json().id
                }
                return fetch(url + "/products", {
                    method: 'POST',
                    body: JSON.stringify(producto),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.json())
            })
            .catch(error => console.error('Error al enviar datos:', error));
    }
}

export {getProductos, getProducto, addProducto};