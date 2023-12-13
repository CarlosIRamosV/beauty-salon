document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.querySelector('.menu-icon');
    const sidebar = document.querySelector('.sidebar');

    menuIcon.addEventListener('click', function () {
        sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
    });

});