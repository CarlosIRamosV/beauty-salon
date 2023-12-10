import {getImageRoute, getProductRoute, getToken} from "../../api.config.js";

window.addEventListener('load', () => {
    let temp
    let urlParams = new URLSearchParams(window.location.search);
    let product = urlParams.get('id');
    if (product == null) {
        window.location.href = 'index.html';
    }
    let image = document.getElementById('imagen');
    let preview = document.getElementById('preview')
    let name = document.getElementById('nombre');
    let description = document.getElementById('descr');
    let price = document.getElementById('precio');
    let stock = document.getElementById('cantidad');

    document.getElementById('update').addEventListener('click', () => {
        let updates = {};

        if (name.value !== temp.name) {
            updates.name = name.value;
        }

        if (description.value !== temp.description) {
            updates.description = description.value;
        }

        if (parseFloat(price.value) !== temp.price) {
            updates.price = parseFloat(price.value)
        }

        if (parseInt(stock.value) !== temp.stock) {
            updates.stock = parseInt(stock.value)
        }

        let new_image;

        if (image.files.length > 0) {
            new_image = image.files[0];
        }

        // Check if there is any change
        if (Object.keys(updates).length === 0 && new_image == null) {
            alert('No hay cambios')
            return;
        }

        if (new_image != null) {
            let blob = new Blob([new_image], {type: new_image.type});
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                let image = {
                    image: reader.result
                }
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
                        updates.image = data.id;
                        update(product, updates);
                    })
                    .catch(error => console.error('Error al enviar datos:', error));
            }
        } else {
            update(product, updates);
        }
    });

    fetch(getProductRoute(product))
        .then(response => response.json())
        .then(data => {
            name.value = data.name;
            if (data.image_id != null) {
                preview.src = getImageRoute(data.image_id);
            }
            description.value = data.description;
            price.value = data.price;
            stock.value = data.stock;
            temp = data;
        })
        .catch(err => console.log(err));
});

function update(product, data) {
    fetch(getProductRoute(product), {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
    })
        .then(response => response.json())
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch(err => console.log(err));
}
