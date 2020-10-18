const outdent = require('outdent');

module.exports = {
    image: function (content, href) {
        return outdent`
        <img
            class="img"
            src="/assets/images${href}"
            alt="${content}"
        />
        `;
    }
}