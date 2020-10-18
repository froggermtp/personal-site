const outdent = require('outdent');

module.exports = {
    image: function (content, href, options = {}) {
        const classes = options.classes && options.classes.join(' ');

        return outdent`
        <img
            class="img ${classes}"
            src="/assets/images${href}"
            alt="${content}"
        />
        `;
    },

    wrappedImage: function (content, href, options = {}) {
        const optionsClasses = options.classes ? options.classes : [];
        const classes = ['wrapper__image', ...optionsClasses];

        return outdent`
        <figure class="wrapper">
            ${module.exports.image(content, href, { classes })}
            ${options.useCaption ? `<figcaption>${content}</figcaption>` : ''}
        </figure>
        `;
    }
}