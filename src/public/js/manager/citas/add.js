window.addEventListener('load', () => {
    function cargarEmpleados() {
        // Puedes reemplazar esta URL con la ubicación real de tu archivo JSON
        const url = 'http://localhost:8080/empleados';

        // Realiza una solicitud AJAX para obtener el JSON
        fetch(url)
            .then(response => response.json())
            .then(empleado => {
                // Obtiene el elemento select
                const empleadoSelect = document.getElementById('empleado');

                // Crea una opción y la agrega al select
                const option = document.createElement('option');
                option.value = empleado.nombre;
                option.textContent = empleado.nombre;
                empleadoSelect.appendChild(option);
            })
            .catch(error => {
                console.error('Error al cargar empleado:', error);
            });
    }
});

function enviarDatos() {
    // Obtiene los valores del formulario
    var nombre = document.getElementById("nombre").value.trim();
    var telefono = document.getElementById("telefono").value.trim();
    var empleado = Array.from(document.getElementById("empleado").selectedOptions).map(option => option.value);
    var empleadoSinCorchetes = empleado.join(', ');
    var servicios = Array.from(document.getElementById("servicios").selectedOptions).map(option => option.value);
    var serviciosSinCorchetes = servicios.join(', ');
    var fecha = document.getElementById("fechaCita").value.trim();
    var hora = document.getElementById("horaCita").value.trim();

    if (!nombre || !telefono || !empleado || !servicios.length || !fecha || !hora) {
        alert("Por favor completa el formulario");
    } else {
        // Crea un objeto JSON con los datos del formulario
        var datosReserva = {
            nombre: nombre,
            telefono: telefono,
            empleado: empleadoSinCorchetes,
            servicios: serviciosSinCorchetes,
            fecha: fecha,
            hora: hora
        };

        // Convierte el objeto JSON a cadena
        var datosJSON = JSON.stringify(datosReserva);
        console.log(datosJSON);

        // Envía los datos a la API (simulado, debes ajustar la URL y método según tu API)
        /*
        fetch('https://ejemplo.com/api/reservar', {
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
    }
}