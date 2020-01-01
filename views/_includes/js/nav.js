const menuButton = document.getElementById('mobile-menu-button');

menuButton.addEventListener('click', function (e) {
    document.querySelector('nav').classList.toggle('fullscreen');
    menuButton.classList.toggle('change');
});