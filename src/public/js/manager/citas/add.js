import { getUserRoute, getToken, getAppointmentRoute, getUserSearchRoute } from "../../api.config.js";

window.addEventListener('load', () => {
    let client = document.getElementById('client');
    let employee = document.getElementById('employee')
    let services = document.getElementById('servicios');
    let fecha = document.getElementById('fechaCita');

    document.getElementById('crud-form').addEventListener('submit', ev => {
        ev.preventDefault();
        let fechaCita = new Date(fecha.value);
        let appointment = {
                client_id: client.value,
                services: services.value,
                employee_id: employee.value,
                date: fechaCita.getTime().toString(),
            };
        console.log(appointment);
        fetch(getAppointmentRoute(), {
        method: 'POST',
        body: JSON.stringify(appointment),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
    })
        .then(response => response.json())
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch(err => console.log(err));
    });

        fetch(getUserRoute(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken(),
            }
        })
            .then(response => response.json())
            .then(data => {
                let select = document.getElementById('clients');
                data.forEach(user => {
                    let option = document.createElement('option');
                    option.value = user.id;
                    option.innerText = user.name + ' ' + user.last_name;
                    select.appendChild(option);
                });
            })
            .catch(err => console.log(err));

        fetch(getUserSearchRoute(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken(),
            }
        })
            .then(response => response.json())
            .then(data => {
                let select = document.getElementById('employees');
                data.forEach(user => {
                    let option = document.createElement('option');
                    option.value = user.id;
                    option.innerText = user.name + ' ' + user.last_name;
                    select.appendChild(option);
                });
            })
            .catch(err => console.log(err));

});