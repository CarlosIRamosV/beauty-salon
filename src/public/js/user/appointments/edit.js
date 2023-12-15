import {getAppointmentRoute, getToken} from "../../api.config.js";
import {employeeDetailList} from "../../lib/users/employee.js";

window.addEventListener('load', () => {
    let temp
    let urlParams = new URLSearchParams(window.location.search);
    let appointment = urlParams.get('id');
    if (appointment == null) {
        window.location.href = './';
    }
    let employee = document.getElementById('employee')
    let services = document.getElementById('servicios');
    let fecha = document.getElementById('fechaCita');

    document.getElementById('crud-form').addEventListener('submit', ev => {
        ev.preventDefault();
        let updates = {};

        let servicesArray = [];
        for (let i = 0; i < services.length; i++) {
            if (services[i].selected) {
                servicesArray.push(services[i].value);
            }
        }

        if (employee.value !== temp.employee_id) {
            updates.employee_id = employee.value;
        }

        if (servicesArray.join(',') !== temp.services) {
            updates.services = servicesArray.join(',');
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
                window.location.href = './';
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
            employee.value = data.employee_id;
            // Set services select
            let servicesArray = data.services.split(',');
            for (let i = 0; i < services.length; i++) {
                if (servicesArray.includes(services[i].value)) {
                    services[i].selected = true;
                }
            }
            let date = new Date();
            date.setTime(data.date);
            // Convert to yyy-MM-ddThh:mm
            let hours = date.getHours();
            if (hours < 10) {
                hours = '0' + hours;
            }
            let minutes = date.getMinutes();
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            date = date.toISOString().slice(0, 10) + 'T' + hours + ':' + minutes;
            fecha.value = date;
            temp = data;
        })
        .catch(err => console.log(err));

    employeeDetailList(document.getElementById('employees'));
});