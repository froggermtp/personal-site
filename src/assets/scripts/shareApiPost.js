(function (document, navigator) {
    function ready() {
        const button = document.querySelector('.js-tutorial-share');
        const title = document.querySelector('title').textContent;
        const text = document.querySelector('meta[name="description"]').getAttribute('content');
        const url = document.querySelector('link[rel="canonical"]').getAttribute('href');
        let timer = null;

        function doShare() {
            if (navigator.share) {
                navigator.share({ title, text, url });
            } else {
                button.innerHTML = 'No Share API available ☹️';

                if (timer) {
                    clearTimeout(timer);
                }

                timer = setTimeout(() => button.innerHTML = 'Share!!!', 2000);
            }
        }

        button.addEventListener('click', doShare);
    }

    if (document.readyState === 'complete') {
        ready();
    } else {
        document.addEventListener('DOMContentLoaded', ready);
    }
})(document, navigator);