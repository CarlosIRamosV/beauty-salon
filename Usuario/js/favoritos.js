function addFavorito(id) {
    fetch('http://139.177.103.192:8080/favorites/' + id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta de la API:', data);
            // Puedes hacer más acciones con la respuesta de la API si es necesario
        })
        .catch(error => console.error('Error al enviar datos:', error));
    if (document.getElementById(id).firstChild.src.match("favrell"))
        document.getElementById(id).firstChild.src = "../../Recursos/fav.png";
    else
        document.getElementById(id).firstChild.src = "../../Recursos/favrell.png";
}

window.addEventListener("load", () => {
    fetch("http://139.177.103.192:8080/product")
        .then(response => response.json())
        .then(data => {
                data.forEach(element => {
                    let div = document.createElement("div");
                    div.className = "producto";
                    div.id = element.id;
                    let img = document.createElement("img");
                    img.src = "../../Recursos/fav.png";
                    img.alt = "icono fav";
                    img.className = "fav";
                    img.onclick = function () {
                        addFavorito(element.id)
                    }
                    div.appendChild(img);
                    let imgProducto = document.createElement("img");
                    imgProducto.src = element.image;
                    imgProducto.alt = element.name;
                    imgProducto.className = "prod";
                    div.appendChild(imgProducto);
                    let nombre = document.createElement("div");
                    nombre.className = "nombre";
                    nombre.innerHTML = element.name;
                    div.appendChild(nombre);
                    let descripcion = document.createElement("div");
                    descripcion.className = "descripcion";
                    descripcion.innerHTML = element.description;
                    div.appendChild(descripcion);
                    document.getElementById("productos").appendChild(div);
                });
            }
        );
});

