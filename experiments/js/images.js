import {url} from "./api.config.js";

window.addEventListener("load", function () {
    document.getElementById("file").onchange = function () {
        let imag = document.getElementById("file").files[0];
        let blob = new Blob([imag], {type: imag.type});
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
                    document.getElementById("uuid").innerText = data.id;
                    document.getElementById("hash").innerText = data.hash;
                    document.getElementById("url").innerText = img_url;
                    document.getElementById("img").src = img_url;

                    console.log(img_url);
                })
                .catch(error => console.error('Error al enviar datos:', error));
        }
    }
});