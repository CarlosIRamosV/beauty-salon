import {getAppointmentSearchRoute, getSessionRoute, getToken,} from "../../api.config.js";
import {validate} from "../lib.js";
import {afterDate} from "../../lib/input/date";


validate();
let data_employee;

window.addEventListener('load', () => {
    document.getElementById("search").addEventListener("submit", ev => {
        ev.preventDefault();
        let after = document.getElementById('despues').value;
        let before = document.getElementById('antes').value;

        let search = {}

        // Get a search parameters
        // After
        afterDate(after, search);

        console.log(search);

        // Before
        afterDate(before, search);

        console.log(search);
        console.log(JSON.stringify(search));

        // If no search parameters, get all products
        if (Object.keys(search).length === 0) {
            load();
            return;
        }

        // If an employee is logged in, add employee id to search
        if (data_employee) {
            search.employee_id = data_employee.id;
        }

        fetch(getAppointmentSearchRoute(), {
                method: 'POST',
                body: JSON.stringify(search),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken(),
                },
            }
        )
            .then(response => response.json())
            .then(data => generateTable(data))
            .catch(err => console.log(err));

    });

    fetch(getSessionRoute(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken(),
        },
    })
        .then(response => response.json())
        .then(data => {
            data_employee = data;
            load();
        })
        .catch(err => console.log(err));
});

function load() {
    fetch(getAppointmentSearchRoute(), {
        method: 'POST',
        body: JSON.stringify({employee_id: data_employee.id}),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken(),
        },
    })
        .then(response => response.json())
        .then(data => generateTable(data))
        .catch(err => console.log(err));
}

function generateTable(data) {

    let table = document.getElementById('table');

    // Clear table
    while (table.getElementsByTagName('tbody').length > 0) {
        table.removeChild(table.lastChild);
    }

    // If no appointments found
    if (data.length === 0) {
        let body = document.createElement('tbody');
        let row = document.createElement('tr');
        let cell = document.createElement('td');
        cell.innerText = 'No users found';
        cell.colSpan = 8;
        row.appendChild(cell);
        body.appendChild(row);
        table.appendChild(body);
        return;
    }
    let body = document.createElement('tbody');
    data.forEach(cita => {
        let row = document.createElement('tr');
        let name = document.createElement('td');
        name.innerText = cita.client.name + ' ' + cita.client.last_name;
        let phone = document.createElement('td');
        phone.innerText = cita.client.phone;
        let employee = document.createElement('td');
        employee.innerText = cita.employee.name + ' ' + cita.employee.last_name;
        let services = document.createElement('td');
        services.innerText = cita.services;
        let date = new Date();
        date.setTime(cita.date);
        let day = document.createElement('td');
        day.innerText = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        let hour = document.createElement('td');
        hour.innerText = date.getHours() + ':' + date.getMinutes();


        // Add cells to row
        row.appendChild(name);
        row.appendChild(phone);
        row.appendChild(employee);
        row.appendChild(services);
        row.appendChild(day);
        row.appendChild(hour);
        body.appendChild(row);
    });
    document.getElementById('table').appendChild(body);
}