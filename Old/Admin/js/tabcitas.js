// Variables globales
let data = []; // Inicialmente, el array de datos está vacío

// Funciones CRUD

function addOrUpdateCita() {
  const idclienteInput = document.getElementById("idcliente");
  const idempleadoInput = document.getElementById("idempleado");
  const fechahoraInput = document.getElementById("fechahora");
  const idserviciosInput = document.getElementById("idservicios");

  const nuevaCita = {
    id_cita: data.length + 1, // Generar un nuevo ID
    idcliente_cita: parseInt(idclienteInput.value),
    idempleado_cita: parseInt(idempleadoInput.value),
    fechahora_cita: fechahoraInput.value,
    idservicios_cita: parseInt(idserviciosInput.value),
  };

  const index = data.findIndex((cita) => cita.id_cita === nuevaCita.id_cita);

  if (index !== -1) {
    // Actualizar cita existente
    data[index] = nuevaCita;
  } else {
    // Agregar nueva cita
    data.push(nuevaCita);
  }

  // Limpiar formulario
  idclienteInput.value = "";
  idempleadoInput.value = "";
  fechahoraInput.value = "";
  idserviciosInput.value = "";

  // Actualizar la tabla y el archivo JSON
  renderTable();
  saveDataToJSON();
}

function editCita(id_cita) {
  const cita = data.find((c) => c.id_cita === id_cita);

  if (cita) {
    const idclienteInput = document.getElementById("idcliente");
    const idempleadoInput = document.getElementById("idempleado");
    const fechahoraInput = document.getElementById("fechahora");
    const idserviciosInput = document.getElementById("idservicios");

    // Llenar el formulario con los datos de la cita seleccionada
    idclienteInput.value = cita.idcliente_cita;
    idempleadoInput.value = cita.idempleado_cita;
    fechahoraInput.value = cita.fechahora_cita;
    idserviciosInput.value = cita.idservicios_cita;
  }
}

function deleteCita(id_cita) {
  // Filtrar la cita con el ID especificado
  data = data.filter((cita) => cita.id_cita !== id_cita);

  // Actualizar la tabla y el archivo JSON
  renderTable();
  saveDataToJSON();
}

// Función para inicializar la tabla
function renderTable() {
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";

  data.forEach((cita) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${cita.id_cita}</td>
      <td>${cita.idcliente_cita}</td>
      <td>${cita.idempleado_cita}</td>
      <td>${cita.fechahora_cita}</td>
      <td>${cita.idservicios_cita}</td>
      <td>
        <button onclick="editCita(${cita.id_cita})">Editar</button>
        <button onclick="deleteCita(${cita.id_cita})">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Función para guardar los datos en el archivo JSON
function saveDataToJSON() {
  fetch('../json/citas.json', {
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
  fetch('../json/citas.json')
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
