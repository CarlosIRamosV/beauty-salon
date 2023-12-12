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


// Inicializa un array vacío para almacenar los products favoritos
var productosFavoritos = [];

//convertir el array de employee a json
var miJson = JSON.stringify(productosFavoritos);
console.log(miJson);

// Función para cambiar la imagen al hacer clic y agregar o quitar el producto al array
function cambiarImagen(image, nombreProducto) {
  // Verifica la fuente actual de la imagen
  if (image.src.match("rell")) {
    // Si la imagen actual es la imagen default, cambia a la otra imagen
    image.src = "../Recursos/fav.png";
    
    // Elimina el nombre del producto del array de products favoritos
    var index = productosFavoritos.indexOf(nombreProducto);
    if (index !== -1) {
      productosFavoritos.splice(index, 1);
    }
    
    // Muestra el array de products favoritos en la consola
    console.log(productosFavoritos);
  } else {
    // Si la imagen actual no es la imagen default, vuelve a la imagen default
    image.src = "../Recursos/favrell.png";
     // Agrega el nombre del producto al array de products favoritos
     productosFavoritos.push(nombreProducto);

   
    
    // Muestra el array de products favoritos en la consola
    console.log(productosFavoritos);
  }
}

function obtenerContenidoNombre(elemento) {
    return elemento.nextElementSibling.nextElementSibling.textContent.trim();
  }

