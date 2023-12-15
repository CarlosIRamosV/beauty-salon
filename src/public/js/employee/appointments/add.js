import {getAppointmentRoute, getSessionRoute, getToken} from "../../api.config.js";
import {clientDetailList} from "../../lib/users/client.js";

window.addEventListener('load', () => {
    let client = document.getElementById('client');
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
            client_id: client.value,
            date: fechaCita.getTime().toString(),
        };
        fetch(getSessionRoute(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken(),
            },
        })
            .then(response => response.json())
            .then(data => {
                appointment.employee_id = data.id;
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
    clientDetailList(document.getElementById('clients'));
});