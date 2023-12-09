/* ------------------ Variables ------------------ */
let devMode = true;

let host = 'http://139.177.103.192:8080';
let local = 'http://localhost:8080';


/* ------------------ Functions ------------------ */
let url = devMode ? local : host;

function getURL() {
    return url;
}

function log(message) {
    if (devMode) {
        console.log(message);
    }
}

/* ------------------ Token ------------------ */
let token = localStorage.getItem('token');

function getToken() {
    if (token === null) {
        token = sessionStorage.getItem('token');
    }

    if (token === null) {
        alert('You are not logged in!');
        window.location.href = 'login.html';
    }
    return token;
}

function setToken(newToken, remember) {
    token = newToken;
    if (remember) {
        localStorage.setItem('token', newToken);
    } else {
        sessionStorage.setItem('token', newToken);
    }
}

function removeToken() {
    token = null;
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
}

/* ------------------ Routes ------------------ */

function getRoute(route) {
    return url + route;
}

function getLoginRoute() {
    return getRoute('/login');
}

function getSessionRoute() {
    return getRoute('/session');
}

function getProductRoute(productId) {
    if (productId === undefined) return getRoute('/products');
    return getRoute('/products/' + productId);
}

function getProductSearchRoute() {
    return getRoute('/products/search');
}

function getImageRoute(imageId) {
    if (imageId === undefined) return getRoute('/images');
    return getRoute('/images/' + imageId);
}

function getUserRoute(userId) {
    if (userId === undefined) return getRoute('/users');
    return getRoute('/users/' + userId);
}

function getAppointmentRoute(appointmentId) {
    if (appointmentId === undefined) return getRoute('/appointments');
    return getRoute('/appointments/' + appointmentId);
}

/* ------------------ Exports ------------------ */
export {
    getURL,
    getRoute,
    getLoginRoute,
    getSessionRoute,
    getProductRoute,
    getProductSearchRoute,
    getImageRoute,
    getUserRoute,
    getAppointmentRoute,
    log,
    getToken,
    setToken,
    removeToken
};

