import {getToken, getUserRoute, getUserSearchRoute} from "./api.config.js";


function loadClientList() {
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
}

function loadEmployeeList() {
    fetch(getUserSearchRoute(), {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken(),
    }
})
    .then(response => response.json())
    .then(data => {
        let select = document.getElementById('users');
        data.forEach(user => {
            let option = document.createElement('option');
            option.value = user.id;
            option.innerText = user.name + ' ' + user.last_name;
            select.appendChild(option);
        });
    })
    .catch(err => console.log(err));
}

function dateInput(after, before, search) {
        if (before) {
            let date = new Date(before);
            date.setDate(date.getDate() + 1);
            search.before_date = date.getTime().toString();
        }
        if (after) {
            let date = new Date(after);
            date.setDate(date.getDate() + 1);
            search.after_date = date.getTime().toString();
        }
        return search;
}


export {loadClientList, loadEmployeeList, dateInput};