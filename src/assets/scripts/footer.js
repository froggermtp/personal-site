(function (document) {
    function ready() {
        const emailEls = document.querySelectorAll('.js-email');

        for (let emailEl of emailEls) {
            emailEl.addEventListener('click', decryptEmail);
        }
    }

    function decryptEmail() {
        var address = atob('bWF0dGhld0BtYXR0aGV3cGFycmlzLm9yZwo=');
        window.location.href = "mailto:" + address;
    }

    if (document.readyState === 'complete') {
        ready();
    } else {
        document.addEventListener('DOMContentLoaded', ready);
    }
})(document);