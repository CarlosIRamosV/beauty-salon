import {afterDate, beforeDate} from "../../lib/input/date.js";
import {generateTableBySearch, generateTableDefault} from "../../lib/appointments/employee.js";
import {clientDetailList} from "../../lib/users/client.js";

window.addEventListener('load', () => {

    let icon = document.createElement('i');
    icon.classList.add('ti', 'ti-square-rounded-plus');
    icon.onclick = () => {
        return window.location.href = './add.html';
    }
    document.getElementById('nav-actions').appendChild(icon);

    let table = document.getElementById('table');
    let client = document.getElementById('client');
    let after = document.getElementById('after');
    let before = document.getElementById('before');

    document.getElementById("search").addEventListener("submit", ev => {
        ev.preventDefault();

        // Search parameters
        let search = {}

        // Client
        if (client.value) {
            search.client_id = client.value
        }

        // After date
        afterDate(after.value, search)

        // Before date
        beforeDate(before.value, search)

        // If no search parameters, get all products
        if (Object.keys(search).length === 0) {
            generateTableDefault(table)
            return;
        }

        // Get search results
        generateTableBySearch(table, search)
    });
    generateTableDefault(table)
    clientDetailList(document.getElementById('clients'))
});
