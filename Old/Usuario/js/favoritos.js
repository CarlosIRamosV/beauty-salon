import {getProductos} from "../../src/public/js/products.employee";
import {url} from "../../src/public/js/api.config.js";

function addFavorito(id) {
    if (document.getElementById(id).firstChild.src.match("favrell"))
        document.getElementById(id).firstChild.src = "../../Recursos/fav.png";
    else
        document.getElementById(id).firstChild.src = "../../Recursos/favrell.png";
}

window.addEventListener("load", async () => {
    let productos = await getProductos();
    productos.forEach(element => {
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
        imgProducto.src = `${url}/image/${element.imageId}`;
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
        document.getElementById("products").appendChild(div);
    });
});

