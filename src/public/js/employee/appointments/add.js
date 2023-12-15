import {getAppointmentRoute, getSessionRoute, getToken} from "../../api.config.js";
import {employeeDetailList} from "../../lib/users/employee.js";

window.addEventListener('load', () => {
    let employee = document.getElementById('employee')
    let services = document.getElementById('servicios');
    let fecha = document.getElementById('fechaCita');


    document.getElementById('crud-form').addEventListener('submit', ev => {
        ev.preventDefault();

        let servicesArray = [];
        for (let i = 0; i < services.length; i++) {
            if (services[i].selected) {
                servicesArray.push(services[i].value);
            }
        }

        let fechaCita = new Date(fecha.value);
        let appointment = {
            services: servicesArray.join(','),
            employee_id: employee.value,
            date: fechaCita.getTime().toString(),
        };
        fetch(getSessionRoute(), {})
            .then(response => response.json())
            .then(data => {
                appointment.client_id = data.id;
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
            })
    });

    employeeDetailList(document.getElementById('employees'))
});