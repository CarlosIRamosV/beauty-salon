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
    
    data.forEach(empleado => {

        let row = document.createElement('tr');
        let imgCell = document.createElement('td');
        if (empleado.image_id) {
            let img = document.createElement('img');
            img.src = url + '/images/' + empleado.image_id;
            imgCell.appendChild(img);
        } else {
            imgCell.innerText = 'No image';
        }
        row.appendChild(imgCell);
        let nombre = document.createElement('td');
        nombre.innerText = empleado.name;
        let apellidos = document.createElement('td');
        apellidos.innerText = empleado.last_name;
        let fechaNac = document.createElement('td');
        fechaNac.innerText = empleado.birth_date;
        let sexo = document.createElement('td');
        sexo.innerText = empleado.sex;
        let telefono = document.createElement('td');
        telefono.innerText = empleado.phone;
        let correo = document.createElement('td');
        correo.innerText = empleado.email;


        // Add buttons
        let edit = document.createElement('td');
        let imgEdit = document.createElement('img');
        imgEdit.src = '../../public/svg/edit.svg';
        edit.appendChild(imgEdit);
        edit.className = 'edit';
        edit.addEventListener('click', ev => {
            window.location.href = 'edit.html?id=' + empleado.id;
        });
        


        let del = document.createElement('td');
        del.className = 'delete';
        let imgDel = document.createElement('img');
        imgDel.src = '../../public/svg/trash.svg';
        del.appendChild(imgDel);
        del.addEventListener('click', ev => {
            fetch(url + '/products/' + empleado.id, {
                method: 'DELETE'
            }).then(response => {
                if (response.status === 200) {
                    window.location.reload();
                }
            }).catch(err => console.log(err));
        });

        // Add cells to row
        row.appendChild(imgCell);
        row.appendChild(nombre);
        row.appendChild(apellidos);
        row.appendChild(fechaNac);
        row.appendChild(sexo);
        row.appendChild(telefono);
        row.appendChild(correo);
        row.appendChild(del);
        body.appendChild(row);
    });
    document.getElementById('table').appendChild(body);
}   