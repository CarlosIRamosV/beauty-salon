import {url} from "../../api.config.js";

window.addEventListener('load', () => {
    loadTable();
});

function loadTable() {
    fetch(url + '/products')
        .then(response => response.json())
        .then(data => generateTable(data))
        .catch(err => console.log(err));
}


function generateTable(data) {
    let body = document.createElement('tbody');
    data.forEach(product => {
        let row = document.createElement('tr');
        let imgCell = document.createElement('td');
        if (product.image_id) {
            let img = document.createElement('img');
            img.src = url + '/images/' + product.image_id;
            imgCell.appendChild(img);
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
        let quantity = document.createElement('td');
        quantity.innerText = product.quantity;

        // Add buttons
        let edit = document.createElement('td');
        let imgEdit = document.createElement('img');
        imgEdit.src = '../../public/svg/edit.svg';
        edit.appendChild(imgEdit);
        edit.className = 'edit';
        edit.addEventListener('click', ev => {
            window.location.href = 'edit.html?id=' + product.id;
        });


        let del = document.createElement('td');
        del.className = 'delete';
        let imgDel = document.createElement('img');
        imgDel.src = '../../public/svg/trash.svg';
        del.appendChild(imgDel);
        del.addEventListener('click', ev => {
            fetch(url + '/products/' + product.id, {
                method: 'DELETE'
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
        row.appendChild(quantity);
        row.appendChild(edit);
        row.appendChild(del);
        body.appendChild(row);
    });
    document.getElementById('table').appendChild(body);
}