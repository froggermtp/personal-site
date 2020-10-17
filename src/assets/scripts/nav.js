const menuButton = document.getElementById('mobile-menu-button');

menuButton.addEventListener('click', function (e) {
    document.querySelector('nav').classList.toggle('fullscreen');
    menuButton.classList.toggle('change');
});

menuButton.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        menuButton.click();
    }
}); 