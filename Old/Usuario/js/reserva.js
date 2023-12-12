function enviarDatos() {
    // Obtiene los valores del formulario
    var nombre = document.getElementById("nombre").value.trim();
    var telefono = document.getElementById("telefono").value.trim();
    var empleado = document.getElementById("empleado").value.trim();
    var servicios = Array.from(document.getElementById("servicios").selectedOptions).map(option => option.value);
    var serviciosSinCorchetes = servicios.join(', ');
    var fecha = document.getElementById("fecha").value.trim();
    var hora = document.getElementById("hora").value.trim();

    if(!nombre || !telefono || !empleado || !servicios.length || !fecha || !hora) {
        alert("Por favor completa el formulario");
    } else {
        // Crea un objeto JSON con los datos del formulario
        var datosReserva = {
            nombre: nombre,
            telefono: telefono,
            empleado: empleado,
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