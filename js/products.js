import {url} from "./api.config.js";

/**
 * Obtener todos los productos
 * @returns lista de productos
 */
function getProductos() {
    return fetch(url + "/product")
        .then(response => response.json())
        .catch(error => console.error('Error al enviar datos:', error));
}

/**
 * Obtener un producto por ID
 * @param id id del producto
 * @returns {Promise<Response | never>} producto
 */
function getProducto(id) {
    return fetch(url + "/product/" + id)
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
    let reader = new FileReader();
    reader.readAsDataURL(imag);
    reader.onloadend = function () {
        let producto = {
            name: name,
            description: description,
            price: price,
            quantity: stock,
            image: reader.result
        }
        return fetch(url + "/product", {
            method: 'POST',
            body: JSON.stringify(producto),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .catch(error => console.error('Error al enviar datos:', error));
    }
}

export {getProductos, getProducto, addProducto};