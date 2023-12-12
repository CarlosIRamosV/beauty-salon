function enviarDatos() {
    // Obtiene los valores de los inputs
    var correo = document.querySelector(".correo").value.trim();
    var contraseña = document.querySelector(".contraseña").value.trim();

    if (!correo || !contraseña) {
        alert("Por favor completa el formulario");
    } else {
        // Crea un objeto JSON con los datos del formulario
        var datosLogin = {
            correo: correo,
            contraseña: contraseña,
        };

        // Convierte el objeto JSON a cadena
        var datosJSON = JSON.stringify(datosLogin);
        console.log(datosJSON);

        // Aquí puedes agregar la lógica para enviar los datos a la API (simulado)
        /*
        fetch('https://ejemplo.com/api/login', {
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