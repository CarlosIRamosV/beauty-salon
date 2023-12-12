import { getToken, getAppointmentRoute } from "../../api.config.js";
import {loadClientList, loadEmployeeList} from "../../lib.js";

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
            window.location.href = 'index.employee';
        })
        .catch(err => console.log(err));
    });

    loadClientList();
    loadEmployeeList();
});