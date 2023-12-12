import {validate} from "../lib.js";
import {generateTableBySearch, generateTableDefault} from "../../lib/appointments/table.js";
import {clientDetailList} from "../../lib/users/client.js";
import {employeeDetailList} from "../../lib/users/employee.js";
import {afterDate, beforeDate} from "../../lib/input/date.js";

validate(true);

window.addEventListener('load', () => {
    let table = document.getElementById('table');
    let employee = document.getElementById('employee');
    let after = document.getElementById('after');
    let before = document.getElementById('before');

    document.getElementById("search").addEventListener("submit", ev => {
        ev.preventDefault();

        // Search parameters
        let search = {}

        // Employee
        if (employee.value) {
            search.employee_id = employee.value;
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
    employeeDetailList(document.getElementById('employees'))
});
