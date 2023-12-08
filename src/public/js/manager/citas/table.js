import {url} from "../../api.config.js";

window.addEventListener('load', () => {
    loadTable();
});

function loadTable() {
    fetch(url + '/products')
        .then(response => response.json())
        .then(data => generateTable(data))
        .catch(err => console.log(err));
}


function generateTable(data) {
    let body = document.createElement('tbody');
    data.forEach(cita => {
        let row = document.createElement('tr');
        let name = document.createElement('td');
        name.innerText = cita.name;
        let telefono = document.createElement('td');
        telefono.innerText = cita.telefono;
        let empleado = document.createElement('td');
        empleado.innerText = cita.empleado;
        let servicios = document.createElement('td');
        servicios.innerText = cita.servicios;
        let fecha = document.createElement('td');
        fecha.innerText = cita.fecha;
        let hora = document.createElement('td');
        hora.innerText = cita.hora;

        // Add buttons
        let edit = document.createElement('td');
        edit.appendChild(imgEdit);
        edit.className = 'edit';
        edit.addEventListener('click', ev => {
            window.location.href = 'edit.html?id=' + cita.id;
        });


        let del = document.createElement('td');
        del.className = 'delete';
        del.addEventListener('click', ev => {
            fetch(url + '/citas/' + cita.id, {
                method: 'DELETE'
            }).then(response => {
                if (response.status === 200) {
                    window.location.reload();
                }
            }).catch(err => console.log(err));
        });


        // Add cells to row
        row.appendChild(name);
        row.appendChild(telefono);
        row.appendChild(empleado);
        row.appendChild(servicios);
        row.appendChild(fecha);
        row.appendChild(hora);
        row.appendChild(edit);
        row.appendChild(del);
        body.appendChild(row);
    });
    document.getElementById('table').appendChild(body);
}