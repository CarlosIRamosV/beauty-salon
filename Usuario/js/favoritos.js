window.addEventListener('load', () => {
    // Llamada a la API para obtener los favoritos
    
    fetch('http://localhost:8080/')
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


// Inicializa un array vacío para almacenar los productos favoritos
var productosFavoritos = [];

// Función para cambiar la imagen al hacer clic y agregar o quitar el producto al array
function cambiarImagen(image, nombreProducto, descripcion,imagen) {
  // Verifica la fuente actual de la imagen
  if (image.src.match("favrell")) {
    // Si la imagen actual es la imagen default, cambia a la otra imagen
    image.src = "../../Recursos/fav.png";

    // Elimina el producto del array de productos favoritos
    var index = productosFavoritos.findIndex(
      (producto) =>
        //producto.nombre === nombreProducto && producto.descripcion === descripcion
        producto.nombre === nombreProducto && 
        producto.descripcion === descripcion &&
        producto.url === imagen 
    );
    
    if (index !== -1) {
      productosFavoritos.splice(index, 1);
      
    }
  } else {
    // Si la imagen actual no es la imagen default, vuelve a la imagen default
    image.src = "../../Recursos/favrell.png";

    // Agrega el producto al array de productos favoritos
    productosFavoritos.push({ nombre: nombreProducto, descripcion: descripcion, url: imagen });
  }

  // Muestra el array de productos favoritos en la consola
  console.log(productosFavoritos);

  
// Convierte el array de JS a JSON
var miJson = JSON.stringify(productosFavoritos);

// Elimina los corchetes del principio y final de la cadena JSON
var miJsonSinCorchetes = miJson.slice(1, -1);

// Muestra en la consola el JSON sin corchetes
console.log(miJsonSinCorchetes);

/*
var apiUrl = 'http://localhost:8080/';

// Configuración de la solicitud
var requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: miJsonSinCorchetes, // La cadena JSON sin corchetes
};

// Realiza la solicitud utilizando fetch
fetch(apiUrl, requestOptions)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
  */
}


//funciones para obtener del valor del nombre descripcion y la imagen

function nombre(elemento) {
  return elemento.nextElementSibling.nextElementSibling.textContent.trim();
}

function descripcion(elemento) {
  return elemento.nextElementSibling.nextElementSibling.nextElementSibling.textContent.trim();
}
function imagen(elemento){
  var imagen = document.getElementById('prod');
  var url = imagen.src;
  return url;
}




/*otra prueba de la funcion
var favoritos={};

function cambiarImagen(imagen,nombre,descripcion){
  if (imagen.src.match("favrell")) {
    // Si la imagen actual es la imagen default, cambia a la otra imagen
    imagen.src = "../../Recursos/fav.png";
    // Almacena los datos en el objeto favoritos

    var index = favoritos.findIndex(
      (producto) =>
        producto.nombre === nombreProducto && producto.descripcion === descripcion
    );
    
    if (index !== -1) {
      favoritos = {};
    }
   
  } else {
    // Si la imagen actual no es la imagen default, vuelve a la imagen default
    imagen.src = "../../Recursos/favrell.png";
    // Elimina los datos del objeto favoritos
    favoritos = {nombre,descripcion};
  }

  // Muestra el objeto de favoritos en la consola
  console.log(favoritos);

  var miJson = JSON.stringify(favoritos);
  console.log(miJson);
}
*/



