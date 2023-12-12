window.addEventListener('load', () => {
    let id;
    fetch('./json/citas.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                let option = document.createElement('option');
                option.value = element.id;
                option.innerHTML = element.name;
                document.getElementById('appointments').appendChild(option);
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
    document.getElementById('appointments').addEventListener('change', () => {
        id = document.getElementById('appointments').value;
        contenido();
    });
});