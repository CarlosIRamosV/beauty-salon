import {getAppointmentRoute, getToken, getUserSearchRoute} from "../../api.config.js";

window.addEventListener('load', () => {
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
        name.innerText = cita.client_id;
        let phone = document.createElement('td');
        phone.innerText = cita.phone;
        let employee = document.createElement('td');
        employee.innerText = cita.employee;
        let services = document.createElement('td');
        services.innerText = cita.services;
        let date = new Date();
        date.setTime(cita.date)
        let day = document.createElement('td');
        day.innerText = date.getDay();
        let hour = document.createElement('td');
        hour.innerText = date.getHours();

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