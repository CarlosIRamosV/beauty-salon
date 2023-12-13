import {getImageRoute, getToken, getUserRoute, getUserSearchRoute} from "../../api.config.js";

window.addEventListener('load', () => {
    if (!getToken()) {
        window.location.href = '../login/login.employee';
    }
    document.getElementById("search").addEventListener("submit", ev => {
        ev.preventDefault();
        let type = document.getElementById('type').value;
        let name = document.getElementById('name').value;
        let lastName = document.getElementById('lastName').value;
        let birthdate = document.getElementById('birthdate').value;
        let sex = document.getElementById('sex').value;
        let phone = document.getElementById('phone').value;
        let email = document.getElementById('email').value;

        let search = {}

        // Get a search parameters
        // User type
        if (type === '1') {
            search.type = 'User';
        } else if (type === '2') {
            search.type = 'Employee';
        } else if (type === '3') {
            search.type = 'Admin';
        }

        // User name
        if (name) {
            search.name = name;
        }

        // User last name
        if (lastName) {
            search.last_name = lastName;
        }

        // User birthdate
        if (birthdate) {
            search.birth_date = birthdate;
        }

        if (sex === '1') {
            search.sex = 'Male';
        } else if (sex === '2') {
            search.sex = 'Female';
        } else if (sex === '3') {
            search.sex = 'Other';
        }

        // User phone
        if (phone) {
            search.phone = phone;
        }

        // User email
        if (email) {
            search.email = email;
        }

        console.log(search);

        // If no search parameters, get all products
        if (Object.keys(search).length === 0) {
            fetch(getUserRoute(), {
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


        fetch(getUserSearchRoute(), {
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
    fetch(getUserRoute(), {
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

    // If no users found
    if (data.length === 0) {
        let body = document.createElement('tbody');
        let row = document.createElement('tr');
        let cell = document.createElement('td');
        cell.innerText = 'No users found';
        cell.colSpan = 10;
        row.appendChild(cell);
        body.appendChild(row);
        table.appendChild(body);
        return;
    }
    let body = document.createElement('tbody');
    data.forEach(user => {
        let row = document.createElement('tr');
        let imgCell = document.createElement('td');
        imgCell.className = 'image';
        if (user.image_id) {
            imgCell.setAttribute('style', 'background-image: url(' + getImageRoute(user.image_id) + ')');
        } else {
            imgCell.innerText = 'No image';
        }
        row.appendChild(imgCell);
        let type = document.createElement('td');
        type.innerText = user.type;
        let nombre = document.createElement('td');
        nombre.innerText = user.name;
        let apellidos = document.createElement('td');
        apellidos.innerText = user.last_name;
        let fechaNac = document.createElement('td');
        let date = new Date();
        date.setTime(user.birth_date);

        // Add 1 to day because it starts at 0
        date.setDate(date.getDate() + 1);

        fechaNac.innerText = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        let sexo = document.createElement('td');
        sexo.innerText = user.sex;
        let telefono = document.createElement('td');
        telefono.innerText = user.phone;
        let correo = document.createElement('td');
        correo.innerText = user.email;


        // Add buttons
        let edit = document.createElement('td');
        let imgEdit = document.createElement('img');
        imgEdit.src = '../../public/svg/edit.svg';
        edit.appendChild(imgEdit);
        edit.className = 'edit';
        edit.addEventListener('click', ev => {
            window.location.href = 'edit.html?id=' + user.id;
        });


        let del = document.createElement('td');
        del.className = 'delete';
        let imgDel = document.createElement('img');
        imgDel.src = '../../public/svg/trash.svg';
        del.appendChild(imgDel);
        del.addEventListener('click', ev => {
            fetch(getUserRoute(user.id), {
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
        row.appendChild(imgCell);
        row.appendChild(type);
        row.appendChild(nombre);
        row.appendChild(apellidos);
        row.appendChild(fechaNac);
        row.appendChild(sexo);
        row.appendChild(telefono);
        row.appendChild(correo);
        row.appendChild(edit);
        row.appendChild(del);
        body.appendChild(row);
    });
    table.appendChild(body);
}   