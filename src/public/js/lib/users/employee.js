import {getToken, getUserSearchRoute} from "../../api.config.js";

function employeeDetailList(list) {
    fetch(getUserSearchRoute(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken(),
        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                let option = document.createElement('option');
                option.value = user.id;
                option.innerText = user.name + ' ' + user.last_name;
                list.appendChild(option);
            });
        })
        .catch(err => console.log(err));
}

export {employeeDetailList}