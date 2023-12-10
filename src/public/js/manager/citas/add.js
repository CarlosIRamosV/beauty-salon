import { getUserRoute, getToken, getAppointmentRoute } from "../../api.config.js";

let idesclavo, idburrito
window.addEventListener("load", () => {
    fetch(getUserRoute(), {
        method: "GET",
        contentType: "application/json",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken(),
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const userEmpleado = document.getElementById("empleado");
            const userCliente = document.getElementById("cliente");

            data.forEach(usuarios => {
                if (usuarios.type === "Employee") {
                    // Crea una opción para cada usarios
                    const option = document.createElement("option");
                    option.value = usuarios.id; // Establece el valor de la opción (puedes cambiar esto según tu necesidad)
                    option.text = usuarios.name + " " + usuarios.last_name; // Establece el texto de la opción
                    idesclavo = usuarios.id;
                    // Agrega la opción al select
                    userEmpleado.appendChild(option);
                }

                if (usuarios.type === "User") {
                    // Crea una opción para cada usarios
                    const option2 = document.createElement("option");
                    option2.value = usuarios.id; // Establece el valor de la opción (puedes cambiar esto según tu necesidad)
                    option2.text = usuarios.name + " " + usuarios.last_name + " " + usuarios.email; // Establece el texto de la opción
                    idburrito = usuarios.id;
                    // Agrega la opción al select
                    userCliente.appendChild(option2);
                }

            });
        })
        .catch(error => {
            console.log(error);
        });

    document.getElementById("crud-form").addEventListener("submit", () => {
        event.preventDefault();
        // Obtiene los valores del formulario
        var cliente = document.getElementById("cliente").value.trim();
        var empleado = document.getElementById("empleado").value.trim();
        var servicios = Array.from(document.getElementById("servicios").selectedOptions).map(option => option.value);
        var serviciosSinCorchetes = servicios.join(', ');
        var fecha = document.getElementById("fecha").value.trim();

        let fechaCita = new Date(fecha);
        console.log(fechaCita.getTime());

        if (!cliente || !empleado || !servicios.length || !fecha) {
            alert("Por favor completa el formulario");
        } else {
            // Crea un objeto JSON con los datos del formulario
            var datosReserva = {
                client_id: idburrito,
                services: serviciosSinCorchetes,
                employee_id: idesclavo,
                date: fechaCita.getTime().toString(),
            };

            // Convierte el objeto JSON a cadena
            var datosJSON = JSON.stringify(datosReserva);
            console.log(datosJSON);

            // Envía los datos a la API (simulado, debes ajustar la URL y método según tu API)

            fetch(getAppointmentRoute(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + getToken()
                },
                body: datosJSON
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Respuesta de la API:', data);
                })
                .catch(error => console.error('Error al enviar datos:', error));

        }
    });

});
