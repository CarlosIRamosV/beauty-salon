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

function getProductsRoute() {
    return getRoute('/products');
}

function getProductRoute(productId) {
    return getRoute('/products/' + productId);
}

function getImagesRoute() {
    return getRoute('/images');
}

function getImageRoute(imageId) {
    return getRoute('/images/' + imageId);
}

function getUsersRoute() {
    return getRoute('/users');
}

function getUserRoute(userId) {
    return getRoute('/users/' + userId);
}

/* ------------------ User ------------------ */
function getUser() {
    sessionStorage.getItem('user');
}

function setUser(user) {
    sessionStorage.setItem('user', user);
}

function removeUser() {
    sessionStorage.removeItem('user');
}

function updateUser() {
    removeUser();
    if (getToken() !== null) {
        fetch(getSessionRoute(), {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + getToken()
            }
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Could not update user');
            }
        }).then(data => {
            setUser(data);
        }).catch(error => {
            log(error)
        });

    } else {
        log('Could not update user')
    }
}

/* ------------------ Exports ------------------ */
export {
    getURL,
    getRoute,
    getLoginRoute,
    getSessionRoute,
    getProductRoute,
    getProductsRoute,
    getImageRoute,
    getImagesRoute,
    getUserRoute,
    getUsersRoute,
    log,
    getToken,
    setToken,
    removeToken,
    getUser,
    setUser,
    removeUser,
    updateUser
};

