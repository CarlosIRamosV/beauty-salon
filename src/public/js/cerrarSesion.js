import {removeToken} from "./api.config.js";

function cerrarSesion(){
    // Obtener el elemento por su ID
    var enlace = document.getElementById("cerrarSesion");

    enlace.href="../../inicio.html";

    removeToken();
    
}

cerrarSesion();