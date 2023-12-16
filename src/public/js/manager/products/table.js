import {getImageRoute, getProductRoute, getProductSearchRoute} from "../../api.config.js";

window.addEventListener('load', () => {
    let icon = document.createElement('i');
    icon.classList.add('ti', 'ti-square-rounded-plus');
    icon.onclick = () => {
        return window.location.href = './add.html';
    }
    document.getElementById('nav-actions').appendChild(icon);

    document.getElementById("search").addEventListener("submit", ev => {
        ev.preventDefault();
        let name = document.getElementById('name').value;
        let description = document.getElementById('description').value;
        let minPrice = document.getElementById('minPrice').value;
        let maxPrice = document.getElementById('maxPrice').value;

        let search = {}

        if (name) {
            search.name = name;
        }

        if (description) {
            search.description = description;
        }

        if (minPrice) {
            search.min_price = parseFloat(minPrice)
        }

        if (maxPrice) {
            search.max_price = parseFloat(maxPrice)
        }

        if (minPrice && maxPrice && search.min_price > search.max_price) {
            alert('Min price cannot be greater than max price');
            return;
        }

        // If no search parameters, get all products
        if (Object.keys(search).length === 0) {
            fetch(getProductRoute())
                .then(response => response.json())
                .then(data => generateTable(data))
                .catch(err => console.log(err));
            return;
        }


        fetch(getProductSearchRoute(), {
                method: 'POST',
                body: JSON.stringify(search),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
            .then(response => response.json())
            .then(data => generateTable(data))
            .catch(err => console.log(err));

    });
    fetch(getProductRoute())
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

    // If no products found
    if (data.length === 0) {
        let body = document.createElement('tbody');
        let row = document.createElement('tr');
        let cell = document.createElement('td');
        cell.innerText = 'No products found';
        cell.colSpan = 7;
        row.appendChild(cell);
        body.appendChild(row);
        table.appendChild(body);
        return;
    }

    let body = document.createElement('tbody');
    data.forEach(product => {
        let row = document.createElement('tr');
        let imgCell = document.createElement('td');
        imgCell.className = 'image';
        if (product.image_id) {
            imgCell.setAttribute('style', 'background-image: url(' + getImageRoute(product.image_id) + ')');
        } else {
            imgCell.innerText = 'No image';
        }
        row.appendChild(imgCell);
        let name = document.createElement('td');
        name.innerText = product.name;
        let description = document.createElement('td');
        description.innerText = product.description;
        let price = document.createElement('td');
        price.innerText = product.price;
        let stock = document.createElement('td');
        stock.innerText = product.stock;

        // Add buttons
        let edit = document.createElement('td');
        let imgEdit = document.createElement('img');
        imgEdit.src = '../../public/svg/edit.svg';
        edit.appendChild(imgEdit);
        edit.className = 'edit icon';
        edit.addEventListener('click', () => {
            window.location.href = 'edit.html?id=' + product.id;
        });


        let del = document.createElement('td');
        del.className = 'delete icon';
        let imgDel = document.createElement('img');
        imgDel.src = '../../public/svg/trash.svg';
        del.appendChild(imgDel);
        del.addEventListener('click', () => {
            fetch(getProductRoute(product.id), {
                method: 'DELETE',
                headers: {
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                if (response.status === 200) {
                    window.location.reload();
                }
            }).catch(err => console.log(err));
        });


        // Add cells to row
        row.appendChild(imgCell);
        row.appendChild(name);
        row.appendChild(description);
        row.appendChild(price);
        row.appendChild(stock);
        row.appendChild(edit);
        row.appendChild(del);
        body.appendChild(row);
    });
    table.appendChild(body);
}