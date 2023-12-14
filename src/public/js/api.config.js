/* ------------------ Variables ------------------ */
let devMode = true;

let host = 'https://apicirvsdb.fly.dev';
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
        throw new Error('User is not logged in');
    }
    return token;
}

function setToken(newToken, user, remember) {
    token = newToken;
    sessionStorage.setItem('user', JSON.stringify(user));
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
    sessionStorage.removeItem('user');
}

function getUser() {
    let user = sessionStorage.getItem('user');
    if (user === null) {
        fetch(getSessionRoute(), {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getToken()
            }
        })
            .then(response => response.json())
            .then(data => {
                sessionStorage.setItem('user', JSON.stringify(data));
                return data;
            })
    }
    return JSON.parse(user);
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

function getFavoriteRoute(productId) {
    if (productId === undefined) return getRoute('/favorites');
    return getRoute('/favorites/' + productId);
}

function getImageRoute(imageId) {
    if (imageId === undefined) return getRoute('/images');
    return getRoute('/images/' + imageId);
}

function getUserRoute(userId) {
    if (userId === undefined) return getRoute('/users');
    return getRoute('/users/' + userId);
}

function getUserSearchRoute() {
    return getRoute('/users/search');
}

function getAppointmentRoute(appointmentId) {
    if (appointmentId === undefined) return getRoute('/appointments');
    return getRoute('/appointments/' + appointmentId);
}

function getAppointmentSearchRoute() {
    return getRoute('/appointments/search');
}

/* ------------------ Exports ------------------ */
export {
    getURL,
    getRoute,
    getLoginRoute,
    getSessionRoute,
    getProductRoute,
    getProductSearchRoute,
    getFavoriteRoute,
    getImageRoute,
    getUserRoute,
    getUserSearchRoute,
    getAppointmentRoute,
    getAppointmentSearchRoute,
    log,
    getToken,
    setToken,
    removeToken,
    getUser
};

