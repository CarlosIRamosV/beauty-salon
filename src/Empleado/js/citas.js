window.addEventListener('load', () => {
    /*
    
    let id;
    fetch('./json/citas.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                let option = document.createElement('option');
                option.value = element.id;
                option.innerHTML = element.name;
                document.getElementById('citas').appendChild(option);
                id = 1;
                contenido();
            })
        })

    function contenido() {
        fetch('./json/citas.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(element => {
                    if (element.id == id) {
                        document.getElementById('listaCitas').innerHTML = '';
                        element.citas.forEach(element => {
                            let cita = document.createElement('div');
                            cita.classList.add('cita');
                            cita.innerHTML = `
                        <p><strong>Hora:</strong> ${element.hora}</p>
                        <p><strong>Nombre:</strong> ${element.nombre}</p>
                        <p><strong>Apellido:</strong> ${element.apellido}</p>
                        <p><strong>Email:</strong> ${element.email}</p>
                        <p><strong>Telefono:</strong> ${element.telefono}</p>
                        <p><strong>Empleado:</strong> ${element.nombreEmpleado}</p>
                        <p><strong>Comentarios:</strong> ${element.comentarios}</p>
                        `;
                            document.getElementById('listaCitas').appendChild(cita);
                        })

                    }
                })
            })

    }
    document.getElementById('citas').addEventListener('change', () => {
        id = document.getElementById('citas').value;
        contenido();
    });

    */

    // Obtener las citas mediante fetch


});

function jennyqintana() {
    alert("Jenny Quintana es mi jainita");
    fetch('../json/citas.json')  // Reemplaza 'ruta/del/archivo.json' con la ruta correcta a tu archivo JSON
        .then(response => response.json())
        .then(citasJson => {
            // Función para filtrar citas según la fecha seleccionada
            function filtrarCitas() {
                const fechaSeleccionada = document.getElementById('citas').value;

                // Obtener la fecha actual
                const fechaActual = new Date();

                // Filtrar citas próximas para la fecha seleccionada
                const citasFiltradas = citasJson.filter(cita => {
                    const citaFecha = new Date(cita.fecha + 'T' + cita.hora);
                    return citaFecha >= fechaActual && citaFecha.toISOString().split('T')[0] === fechaSeleccionada;
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
            }

            // Llamada inicial para mostrar todas las citas
            filtrarCitas();
        })
        .catch(error => console.error('Error al obtener las citas:', error));
}