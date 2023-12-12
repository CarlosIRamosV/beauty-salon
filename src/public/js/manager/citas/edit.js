import { getToken, getAppointmentRoute } from "../../api.config.js";
import {loadClientList, loadEmployeeList} from "../../lib.js"

window.addEventListener('load', () => {
    let temp
    let urlParams = new URLSearchParams(window.location.search);
    let appointment = urlParams.get('id');
    if (appointment == null) {
        window.location.href = 'index.employee';
    }
    let client = document.getElementById('client');
    let employee = document.getElementById('employee')
    let services = document.getElementById('servicios');
    let fecha = document.getElementById('fechaCita');

    document.getElementById('crud-form').addEventListener('submit', ev => {
        ev.preventDefault();
        let updates = {};

        if (client.value !== temp.client_id) {
            updates.client_id = client.value;
        }

        if (employee.value !== temp.employee_id) {
            updates.employee_id = employee.value;
        }

        if (services.value !== temp.services) {
            updates.services = services.value
        }

        let fechaCita = new Date(fecha.value);
        if (fechaCita.getTime() !== temp.date) {
            updates.date = fechaCita.getTime().toString();
        }

        // Check if there is any change
        if (Object.keys(updates).length === 0) {
            alert('No hay cambios')
            return;
        }

        fetch(getAppointmentRoute(appointment), {
        method: 'PUT',
        body: JSON.stringify(updates),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
    })
        .then(response => response.json())
        .then(() => {
            window.location.href = 'index.employee';
        })
        .catch(err => console.log(err));
    });

    fetch(getAppointmentRoute(appointment), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
    })
        .then(response => response.json())
        .then(data => {
            client.value = data.client_id;
            employee.value = data.employee_id;
            services.value = data.services;
            let date = new Date();
            date.setTime(data.date);
            date = date.toISOString().slice(0, 16);
            fecha.value = date;
            temp = data;
        })
        .catch(err => console.log(err));
    
        loadClientList();
        loadEmployeeList();
});