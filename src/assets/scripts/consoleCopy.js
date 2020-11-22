(function (document, navigator) {
    const showCopyButton = navigator.clipboard && navigator.clipboard.writeText;
    const consoles = document.querySelectorAll('.js-console');
    consoles.forEach(console => {
        const consoleBtn = document.querySelector('.js-console-btn');

        if (!showCopyButton) {
            consoleBtn.styles.display = 'none';
            return;
        }

        consoleBtn.addEventListener('click', e => {
            const prefix = console.dataset.prefix;
            const lines = console.querySelectorAll('.js-console-line');
            let text = '';
            lines.forEach(line => {
                text += line.innerHTML
                    .replace(prefix, '');
            });
            navigator.clipboard.writeText(text);
        });
    });
})(document, navigator);