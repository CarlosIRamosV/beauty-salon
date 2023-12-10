import { getAppointmentRoute, getToken } from "../../public/js/api.config.js"


var fecha = document.getElementById('citas');

// Asignar la función al evento de clic del botón
fecha.addEventListener('change', () => {
    fetch(getAppointmentRoute(), {
        method: "GET",
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + getToken(),
        }
    })  // Reemplaza 'ruta/del/archivo.json' con la ruta correcta a tu archivo JSON
        .then(response => response.json())
        .then(citasJson => {
            // Función para filtrar citas según la fecha seleccionada
            function filtrarCitas() {
                /** 
                // Obtener la fecha seleccionada del campo de entrada de fecha
                const fechaSeleccionada = document.getElementById('citas').value;

                // Convertir la fecha seleccionada a un objeto de fecha
                const fechaSeleccionadaObj = new Date(fechaSeleccionada);

                // Filtrar citas para la fecha seleccionada
                const citasFiltradas = citasJson.filter(cita => {
                    // Convertir la fecha de la cita a un objeto de fecha
                    const citaFecha = new Date(Number(cita.date));

                    // Comparar solo la fecha (ignorando la hora) usando toISOString()
                    return citaFecha.toISOString().split('T')[0] === fechaSeleccionadaObj.toISOString().split('T')[0];
                });

                // Mostrar las citas filtradas en HTML
                const citasContainer = document.getElementById('citas-container');
                citasContainer.innerHTML = '';

                if (citasFiltradas.length > 0) {
                    citasFiltradas.forEach(cita => {
                        const citaElement = document.createElement('div');
                        citaElement.classList.add('cita');
                        citaElement.innerHTML = `
            <strong>Nombre:</strong> ${cita.nombre} <br>
            <strong>Fecha:</strong> ${cita.fecha} <br>
            <strong>Hora:</strong> ${cita.hora} <br>
            <strong>Servicios:</strong> ${cita.servicios} <br>
            <hr>
          `;
                        citasContainer.appendChild(citaElement);
                    });
                } else {
                    citasContainer.innerHTML = '<p>No hay citas para la fecha seleccionada.</p>';
                }
                */
            }

            // Llamada inicial para mostrar todas las citas
            filtrarCitas();
        })
        .catch(error => console.error('Error al obtener las citas:', error));
});