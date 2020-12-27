(function (document, navigator) {
    function ready() {
        if (!navigator.share) {
            return;
        }

        const linkEl = document.createElement('a');
        linkEl.innerHTML = 'Share';
        linkEl.classList.add('link', 'link--share');
        linkEl.addEventListener('click', doSharing);

        const containerEl = document.querySelector(".js-share");
        containerEl.appendChild(linkEl);
    }

    function doSharing() {
        navigator.share({
            title: document.querySelector('title').textContent,
            text: document.querySelector('meta[name="description"]').getAttribute('content'),
            url: document.querySelector('link[rel="canonical"]').getAttribute('href')
        });
    }

    if (document.readyState === 'complete') {
        ready();
    } else {
        document.addEventListener('DOMContentLoaded', ready);
    }
})(document, navigator);