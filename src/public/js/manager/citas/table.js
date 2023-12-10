import {
    getAppointmentRoute,
    getAppointmentSearchRoute,
    getToken,
} from "../../api.config.js";

window.addEventListener('load', () => {
    document.getElementById("search").addEventListener("submit", ev => {
        ev.preventDefault();
        let after = document.getElementById('after').value;
        let before = document.getElementById('before').value;

        let search = {}

        // Get a search parameters
        // After date
        if (after) {
            let date = new Date(after);
            search.after_date = date.getTime().toString();
        }

        // Before date
        if (before) {
            let date = new Date(before);
            search.before_date = date.getTime().toString();
        }

        console.log(search);

        // If no search parameters, get all products
        if (Object.keys(search).length === 0) {
            fetch(getAppointmentRoute(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken(),
                },
            })
                .then(response => response.json())
                .then(data => generateTable(data))
                .catch(err => console.log(err));
            return;
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
    fetch(getAppointmentRoute(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken(),
        }
    })
        .then(response => response.json())
        .then(data => generateTable(data))
        .catch(err => console.log(err));
});

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
        name.innerText = cita.client_name + ' ' + cita.client_last_name;
        let phone = document.createElement('td');
        phone.innerText = cita.client_phone;
        let employee = document.createElement('td');
        employee.innerText = cita.employee_name + ' ' + cita.employee_last_name;
        let services = document.createElement('td');
        services.innerText = cita.services;
        let date = new Date();
        date.setTime(cita.date)
        console.log("Date of appointment: " + date);
        let day = document.createElement('td');
        day.innerText = (date.getDate()+1) + '/' + (date.getMonth() + 1)  + '/' + date.getFullYear();
        let hour = document.createElement('td');
        hour.innerText = date.getHours() + ':' + date.getMinutes();

        // Add buttons
        let edit = document.createElement('td');
        let imgEdit = document.createElement('img');
        imgEdit.src = '../../public/svg/edit.svg';
        edit.appendChild(imgEdit);
        edit.className = 'edit';
        edit.addEventListener('click', ev => {
            window.location.href = 'edit.html?id=' + cita.id;
        });

        let del = document.createElement('td');
        del.className = 'delete';
        let imgDel = document.createElement('img');
        imgDel.src = '../../public/svg/trash.svg';
        del.appendChild(imgDel);
        del.addEventListener('click', ev => {
            fetch(getAppointmentRoute(cita.id), {
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

        // Add cells to row
        row.appendChild(name);
        row.appendChild(phone);
        row.appendChild(employee);
        row.appendChild(services);
        row.appendChild(day);
        row.appendChild(hour);
        row.appendChild(edit);
        row.appendChild(del);
        body.appendChild(row);
    });
    document.getElementById('table').appendChild(body);
}