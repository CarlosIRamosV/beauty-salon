import {getAppointmentRoute, getAppointmentSearchRoute, getToken,} from "../../api.config.js";

function generateTable(table, data) {

    // Clear table
    while (table.getElementsByTagName('tbody').length > 0) {
        table.removeChild(table.lastChild);
    }

    // If no appointments found
    if (data.length === 0) {
        let body = document.createElement('tbody');
        let row = document.createElement('tr');
        let cell = document.createElement('td');
        cell.innerText = 'No hay citas registradas';
        cell.colSpan = 8;
        row.appendChild(cell);
        body.appendChild(row);
        table.appendChild(body);
        return;
    }

    let body = document.createElement('tbody');
    data.forEach(appointment => {
        // Create row
        let row = document.createElement('tr');

        // Client name
        let name = document.createElement('td');
        name.innerText = appointment.client.name + ' ' + appointment.client.last_name;
        row.appendChild(name);

        // Client phone
        let phone = document.createElement('td');
        phone.innerText = appointment.client.phone;
        row.appendChild(phone);

        // Employee name
        let employee = document.createElement('td');
        employee.innerText = appointment.employee.name + ' ' + appointment.employee.last_name;
        row.appendChild(employee);

        // Services
        let services = document.createElement('td');
        // check if service have more than one service
        if (appointment.services.search(',') !== -1) {
            let servicesArray = appointment.services.split(',');
            servicesArray.forEach(service => {
                let serviceSpan = document.createElement('span');
                serviceSpan.innerText = service;
                services.appendChild(serviceSpan);
            });
        } else {
            services.innerText = appointment.services;
        }
        //services.innerText = appointment.services;
        row.appendChild(services);

        // Date
        let date = new Date();
        date.setTime(appointment.date)
        let day = document.createElement('td');
        day.innerText = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        row.appendChild(day);

        // Hour
        let hour = document.createElement('td');
        hour.innerText = date.getHours() + ':' + date.getMinutes();
        row.appendChild(hour);

        // Edit button
        row.appendChild(editAppointment(appointment.id));

        // Delete button
        row.appendChild(deleteAppointment(appointment.id));

        // Append row to table
        body.appendChild(row);
    });
    table.appendChild(body);
}


function editAppointment(id) {
    let td = document.createElement('td');
    td.className = 'edit';
    let imgEdit = document.createElement('img');
    imgEdit.src = '../../public/svg/edit.svg';
    td.appendChild(imgEdit);
    td.addEventListener('click', () => {
        window.location.href = 'edit.html?id=' + id;
    });
    return td;
}

function deleteAppointment(id) {
    let td = document.createElement('td');
    td.className = 'delete';
    let imgDel = document.createElement('img');
    imgDel.src = '../../public/svg/trash.svg';
    td.appendChild(imgDel);
    td.addEventListener('click', () => {
        fetch(getAppointmentRoute(id), {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + getToken(),
            }
        }).then(response => {
            if (response.status === 200) {
                window.location.reload();
            }
        }).catch(err => console.log(err));
    });
    return td;
}

function generateTableDefault(table) {
    fetch(getAppointmentRoute(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken(),
        },
    })
        .then(response => response.json())
        .then(data => generateTable(table, data))
        .catch(err => console.log(err));
}

function generateTableBySearch(table, search) {
    fetch(getAppointmentSearchRoute(), {
        method: 'POST',
        body: JSON.stringify(search),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken(),
        },
    })
        .then(response => response.json())
        .then(data => generateTable(table, data))
        .catch(err => console.log(err));
}

export {generateTableDefault, generateTableBySearch};
