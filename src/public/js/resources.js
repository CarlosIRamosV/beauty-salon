import {url} from "./api.config.js";

let lastImage = null;

/**
 * Subir una imagen al servidor
 * @param imag archivo de imagen
 * @returns {Promise<Response | never>} producto registrado
 */
async function uploadImage(imag) {

    await addImage(blob);
}

/**
 * Subir una imagen al servidor
 * @param imag base64 de la imagen
 * @returns {Promise<Response | never>} imagen registrada
 */
async function addImage(imag) {
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
                console.log('Success:', data);
                lastImage = data;
                return data;
            })
            .catch(error => console.error('Error al enviar datos:', error));
    }
}

/**
 * Obtener la ultima imagen subida
 * @returns {null|*} datos de la ultima imagen subida
 */
function getLastImageData() {
    return lastImage;
}

/**
 * Obtener la url de la ultima imagen subida
 * @returns {string} url de la ultima imagen subida
 */
function getLastImageURL() {
    return url + "/images/" + lastImage.id;
}

export {addImage, uploadImage, getLastImageData, getLastImageURL};

//