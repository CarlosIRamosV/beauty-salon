import { getImageRoute, getProductRoute, getToken } from "../../api.config.js";
import previewImage from "../../lib/input/image.js";

window.addEventListener("load", () => {
    let preview = document.getElementById('preview');
    let imag = document.getElementById("file");

    previewImage(imag, preview);

    document.getElementById("crud-form").addEventListener('submit', (ev) => {
        ev.preventDefault();

        // Mover la obtención de valores dentro del evento de envío del formulario
        let name = document.getElementById("name").value;
        let description = document.getElementById("description").value;
        let price = document.getElementById("price").value;
        let stock = document.getElementById("stock").value;

        let imag = document.getElementById("file").files[0];
        let blob = new Blob([imag], { type: imag.type });
        let reader = new FileReader();

        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            let image = {
                image: reader.result
            };

            // Enviar la imagen y, una vez completado, crear el producto
            fetch(getImageRoute(), {
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
                    })
                        .then(response => response.json())
                        .then(product => alert("Product created with id: " + product.id))
                        .catch(error => console.error('Error al crear producto:', error));
                })
                .catch(error => console.error('Error al enviar imagen:', error));
        };
    });
});