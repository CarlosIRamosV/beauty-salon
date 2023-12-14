import {getAppointmentRoute, getToken} from "../../api.config.js";
import {clientDetailList} from "../../lib/users/client.js";
import {employeeDetailList} from "../../lib/users/employee.js";

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
                return window.location.href = './';
            })
            .catch(err => console.log(err));
    });

    clientDetailList(document.getElementById('clients'))
    employeeDetailList(document.getElementById('employees'))
});