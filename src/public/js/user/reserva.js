import { getUserRoute, getToken, getAppointmentRoute, getSessionRoute } from "../api.config.js";

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
            const userSelect = document.getElementById("empleado");

            data.forEach(empleado => {
                if (empleado.type === "Employee") {
                    // Crea una opción para cada empleado
                    const option = document.createElement("option");
                    option.value = empleado.id; // Establece el valor de la opción (puedes cambiar esto según tu necesidad)
                    option.text = empleado.name + " " + empleado.last_name; // Establece el texto de la opción
                    idesclavo=empleado.id;
                    // Agrega la opción al select
                    userSelect.appendChild(option);
                }
            });
        })
        .catch(error => {
            console.log(error);
        });

        fetch(getSessionRoute(), {
            method: "GET",
            contentType: "application/json",
            headers: {
                'Authorization': 'Bearer ' + getToken(),
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                idburrito=data.id
            })
            .catch(error => console.log(error));

            document.getElementById("reserva").addEventListener("submit", () => {
                event.preventDefault();
                // Obtiene los valores del formulario
                var nombre = document.getElementById("nombre").value.trim();
                var telefono = document.getElementById("telefono").value.trim();
                var empleado = document.getElementById("empleado").value.trim();
                var servicios = Array.from(document.getElementById("servicios").selectedOptions).map(option => option.value);
                var serviciosSinCorchetes = servicios.join(', ');
                var fecha = document.getElementById("fecha").value.trim();

                let fechaCita = new Date(fecha);
                console.log(fechaCita.getTime());
            
                if (!nombre || !telefono || !empleado || !servicios.length || !fecha) {
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
                            alert("Reserva realizada con exito");
                        })
                        .catch(error => console.error('Error al enviar datos:', error));
            
                }
            });

});
