window.addEventListener('load', () => {
    // Llamada a la API para obtener los favoritos
    fetch('./json/favoritos.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                let div = document.createElement('div');
                div.classList.add('favorito');
                div.classList.add('producto');
                div.innerHTML = `
                    <img src="${element.image}" alt="Imagen de ${element.nombre}">
                    <h3>${element.name}</h3>
                    <p>${element.description}</p>
                    <p>${element.price}€</p>
                    <button class="btn btn-danger">Eliminar</button>
                    <button class="btn btn-success" onclick="window.location.href='#?add=${element.id}'">Añadir al carrito</button>
                `;
                document.getElementById('favoritos').appendChild(div);
            })
        })
});