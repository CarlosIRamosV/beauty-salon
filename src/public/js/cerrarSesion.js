import { removeToken } from "./api.config.js";

var boton = document.getElementById('cerrarSesion');

// Asignar la función al evento de clic del botón
boton.addEventListener('click', () => {
    removeToken();
    window.location.href = "../../inicio.html";
});