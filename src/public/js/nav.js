import {getToken} from "./api.config.js";

window.addEventListener('load', () => {
    /*=============== SHOW MENU ===============*/
    let navMenu = document.getElementById('nav-menu'),
        navClose = document.getElementById('nav-close')

    /* Menu hidden */
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu')
    })

    try {
        getToken();
        let icon = document.createElement('i');
        icon.classList.add('ti', 'ti-logout');
        icon.onclick = () => {
            window.location.href = '/sign/out.html';
        }
        document.getElementById('nav-actions').appendChild(icon);
    } catch (e) {
        let icon = document.createElement('i');
        icon.classList.add('ti', 'ti-login');
        icon.onclick = () => {
            window.location.href = '/sign/in.html';
        }
        document.getElementById('nav-actions').appendChild(icon);
    }

    let toggle = document.createElement('div');
    toggle.classList.add('toggle');
    toggle.id = 'nav-toggle';
    toggle.onclick = () => {
        navMenu.classList.toggle('show-menu');
    }
    toggle.innerHTML = '<i class="ti ti-menu"></i>';
    document.getElementById('nav-actions').appendChild(toggle);
});