/*
function enviarDatos() {
    // Obtiene los valores del formulario
    var rol = document.getElementById("rol").value.trim();  // Asumí que hay un campo con el id "rol".
    var nombre = document.getElementById("nombre").value.trim();
    var telefono = document.getElementById("telefono").value.trim();
    var apellido = document.getElementById("apellido").value.trim();
    var fechaNac = document.getElementById("fechaNac").value.trim();
    var sexo = document.getElementById("sexo").value.trim();
    var correo = document.getElementById("correo").value.trim();

    if (!nombre || !telefono || !rol || !apellido || !fechaNac || !sexo || !correo) {
        alert("Por favor completa el formulario");
    } else {
        // Crea un objeto JSON con los datos del formulario
        var datosEmpleado = {
            rol: rol,
            nombre: nombre,
            telefono: telefono,
            apellido: apellido,
            fechaNac: fechaNac,
            sexo: sexo,
            correo: correo
        };

        // Convierte el objeto JSON a cadena
        var datosJSON = JSON.stringify(datosEmpleado);
        console.log(datosJSON);

        // Aquí puedes agregar la lógica de envío de datos a la API
        // La sección de fetch está comentada, deberás descomentar y ajustar según tu API real.
        /*
        fetch('https://ejemplo.com/api/agregarEmpleado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: datosJSON
        })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta de la API:', data);
            // Puedes hacer más acciones con la respuesta de la API si es necesario
        })
        .catch(error => console.error('Error al enviar datos:', error));
        */
/*   }
}*/


import { getImageRoute, getUserRoute, getToken} from "../../api.config.js";

window.addEventListener("load", () => {
    document.getElementById("crud-form").addEventListener('submit', (ev) => {
        ev.preventDefault();
        var name = document.getElementById("nombre").value.trim();
        var phone = document.getElementById("telefono").value.trim();
        var last_name = document.getElementById("apellido").value.trim();
        var birth_date = document.getElementById("fechaNac").value.trim();
        var sex = document.getElementById("sexo").value.trim();
        var email = document.getElementById("correo").value.trim();
        var password = document.getElementById("contraseña").value.trim();
        let imag = document.getElementById("imagen").files[0];
        let blob = new Blob([imag], { type: imag.type });
        let reader = new FileReader();
        reader.readAsDataURL(blob);

        //VARIABLES PARA CONFIRMAR CONTRASE;A
        var confpass = document.getElementById("contraseña").value;
        var confpass2 = document.getElementById("cContraseña").value;

        //CONFIRMAR CONTRASEÑA
        if (confpass != confpass2) {
            alert('Las contraseñas no coinciden');
            return false;
        }

        reader.onloadend = function () {
            let image = {
                image: reader.result
            }

            return fetch(getImageRoute(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
                body: JSON.stringify(image)
            })
                .then(response => response.json())
                .then(data => {
                    let empleado = {
                        image_id: data.id,
                        name: name,
                        last_name: last_name,
                        birth_date: birth_date,
                        sex: sex,
                        phone: phone,
                        email: email,
                        password: password
                    }
                    console.log(empleado)
                    fetch(getUserRoute(), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': 'Bearer ' + getToken()
                        },
                        body: JSON.stringify(empleado)
                    }).then(response => response.json())
                        .then(empleado => alert("Empleado created with id: " + empleado.id));
                })
                .catch(error => console.error('Error al enviar datos:', error));
        }
    });
});