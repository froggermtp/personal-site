var matthewShare = (function (window, document) {
    'use strict';

    function attemptToAddShareButton() {
        if (!navigator.share) {
            return;
        }

        const containerEl = document.querySelector(".js-share");
        const html = `
            <a href="javascript:matthewShare.doSharing()" class="link link--share">Share</a>
        `;

        containerEl.insertAdjacentHTML("beforeend", html);
    }

    function doSharing() {
        navigator.share({
            title: document.querySelector('title').textContent,
            text: document.querySelector('meta[name="description"]').getAttribute('content'),
            url: document.querySelector('link[rel="canonical"]').getAttribute('href')
        });
    }

    return {
        attemptToAddShareButton,
        doSharing
    }
})(window, document);

matthewShare.attemptToAddShareButton();