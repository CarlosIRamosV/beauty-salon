// Variables globales
let data = []; // Inicialmente, el array de datos está vacío

// Funciones CRUD

function addOrUpdateProducto() {
  const nombreInput = document.getElementById("nombre");
  const descrInput = document.getElementById("descr");
  const precioInput = document.getElementById("precio");
  const cantidadInput = document.getElementById("cantidad");
  const favoritosInput = document.getElementById("favoritos");

  const nuevoProducto = {
    id_producto: data.length + 1, // Generar un nuevo ID
    nombre_producto: nombreInput.value,
    descr_producto: descrInput.value,
    precio_producto: parseFloat(precioInput.value),
    cantidad_producto: parseInt(cantidadInput.value),
    favoritos_producto: parseInt(favoritosInput.value),
  };

  const index = data.findIndex((producto) => producto.id_producto === nuevoProducto.id_producto);

  if (index !== -1) {
    // Actualizar producto existente
    data[index] = nuevoProducto;
  } else {
    // Agregar nuevo producto
    data.push(nuevoProducto);
  }

  // Limpiar formulario
  nombreInput.value = "";
  descrInput.value = "";
  precioInput.value = "";
  cantidadInput.value = "";
  favoritosInput.value = "";

  // Actualizar la tabla y el archivo JSON
  renderTable();
  saveDataToJSON();
}

function editProducto(id_producto) {
  const producto = data.find((p) => p.id_producto === id_producto);

  if (producto) {
    const nombreInput = document.getElementById("nombre");
    const descrInput = document.getElementById("descr");
    const precioInput = document.getElementById("precio");
    const cantidadInput = document.getElementById("cantidad");
    const favoritosInput = document.getElementById("favoritos");

    // Llenar el formulario con los datos del producto seleccionado
    nombreInput.value = producto.nombre_producto;
    descrInput.value = producto.descr_producto;
    precioInput.value = producto.precio_producto;
    cantidadInput.value = producto.cantidad_producto;
    favoritosInput.value = producto.favoritos_producto;
  }
}

function deleteProducto(id_producto) {
  // Filtrar el producto con el ID especificado
  data = data.filter((producto) => producto.id_producto !== id_producto);

  // Actualizar la tabla y el archivo JSON
  renderTable();
  saveDataToJSON();
}

// Función para inicializar la tabla
function renderTable() {
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";

  data.forEach((producto) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${producto.id_producto}</td>
      <td>${producto.nombre_producto}</td>
      <td>${producto.descr_producto}</td>
      <td>${producto.precio_producto}</td>
      <td>${producto.cantidad_producto}</td>
      <td>${producto.favoritos_producto}</td>
      <td>
        <button onclick="editProducto(${producto.id_producto})">Editar</button>
        <button onclick="deleteProducto(${producto.id_producto})">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Función para guardar los datos en el archivo JSON
function saveDataToJSON() {
  fetch('../json/productos.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => console.log('Datos guardados:', data))
  .catch(error => console.error('Error al guardar datos:', error));
}

// Función para cargar datos desde el archivo JSON
function loadJSONData() {
  fetch('../json/productos.json')
    .then(response => response.json())
    .then(jsonData => {
      data = jsonData;
      renderTable();
    })
    .catch(error => console.error('Error al cargar datos:', error));
}

// Inicializar la tabla al cargar la página
window.onload = function() {
  loadJSONData();
};
