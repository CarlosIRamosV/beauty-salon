// Variables globales
let data = []; // Inicialmente, el array de datos está vacío

// Funciones CRUD

function addOrUpdateEmpleado() {
  const telefonoInput = document.getElementById("telefono");
  const especialidadInput = document.getElementById("especialidad");

  const nuevoEmpleado = {
    id_empleado: data.length + 1, // Generar un nuevo ID
    telefono_empleado: telefonoInput.value,
    id_especialidad_empleado: parseInt(especialidadInput.value),
  };

  const index = data.findIndex((empleado) => empleado.id_empleado === nuevoEmpleado.id_empleado);

  if (index !== -1) {
    // Actualizar empleado existente
    data[index] = nuevoEmpleado;
  } else {
    // Agregar nuevo empleado
    data.push(nuevoEmpleado);
  }

  // Limpiar formulario
  telefonoInput.value = "";
  especialidadInput.value = "";

  // Actualizar la tabla y el archivo JSON
  renderTable();
  saveDataToJSON();
}

function editEmpleado(id_empleado) {
  const empleado = data.find((e) => e.id_empleado === id_empleado);

  if (empleado) {
    const telefonoInput = document.getElementById("telefono");
    const especialidadInput = document.getElementById("especialidad");

    // Llenar el formulario con los datos del empleado seleccionado
    telefonoInput.value = empleado.telefono_empleado;
    especialidadInput.value = empleado.id_especialidad_empleado;
  }
}

function deleteEmpleado(id_empleado) {
  // Filtrar el empleado con el ID especificado
  data = data.filter((empleado) => empleado.id_empleado !== id_empleado);

  // Actualizar la tabla y el archivo JSON
  renderTable();
  saveDataToJSON();
}

// Función para inicializar la tabla
function renderTable() {
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";

  data.forEach((empleado) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${empleado.id_empleado}</td>
      <td>${empleado.telefono_empleado}</td>
      <td>${empleado.id_especialidad_empleado}</td>
      <td>
        <button onclick="editEmpleado(${empleado.id_empleado})">Editar</button>
        <button onclick="deleteEmpleado(${empleado.id_empleado})">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Función para guardar los datos en el archivo JSON
function saveDataToJSON() {
  fetch('../json/empleados.json', {
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
  fetch('../json/empleados.json')
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
