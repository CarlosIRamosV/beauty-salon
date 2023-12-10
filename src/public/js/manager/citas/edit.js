import {
    getToken,
    getUserRoute,
    getImageRoute,
    getAppointmentRoute,
    getUserSearchRoute,
    getProductRoute
} from "../../api.config.js";

window.addEventListener('load', ev => {
    let urlParams = new URLSearchParams(window.location.search);
    let product = urlParams.get('id');
    if (product == null) {
        window.location.href = 'index.html';
    }

    let client_id = document.getElementById('cliente');
    let birth_date = document.getElementById('fechaNac');
    let sex = document.getElementById('sexo');
    let phone = document.getElementById('telefono');
    let email = document.getElementById('correo');

    fetch(getAppointmentRoute(product))
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // Asignar valores a los campos de entrada
            name.value = data.name;
            last_name.value = data.last_name;
            birth_date.value = data.birth_date;
            sex.value = data.sex;
            phone.value = data.phone;
            email.value = data.email;
        })
        .catch(err => console.log(err));
});