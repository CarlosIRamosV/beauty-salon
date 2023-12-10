import { getUserRoute, getProductRoute, getToken, getAppointmentRoute, getUserSearchRoute } from "../../api.config.js";

window.addEventListener('load', () => {
    let temp
    let urlParams = new URLSearchParams(window.location.search);
    let product = urlParams.get('id');
    if (product == null) {
        window.location.href = 'index.html';
    }
    let client = document.getElementById('client');
    let employee = document.getElementById('employee')
    let services = document.getElementById('servicios');
    let date = document.getElementById('fechaCita');

    document.getElementById('update').addEventListener('click', () => {
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

        // Check if there is any change
        if (Object.keys(updates).length === 0) {
            alert('No hay cambios')
            return;
        }

        update(product, updates);
    });

    fetch(getAppointmentRoute(product), {
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
            date.value = data.date;
            temp = data;
        })
        .catch(err => console.log(err));
    
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

function update(product, data) {
    fetch(getAppointmentRoute(product), {
        method: 'PUT',
        body: JSON.stringify(data),
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
}
