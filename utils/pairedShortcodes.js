const outdent = require('outdent');
const hash = require('../src/data/hash.json');

module.exports = {
    image: function (content, href, options = {}) {
        const classes = options.classes ? options.classes.join(' ') : '';

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
    },

    script: function (content, options = {}) {
        const pathPrefix = '/assets/scripts/';
        const regex = RegExp(/^.*\.js/);
        const srcs = content
            .split('\n')
            .map(line => line.replace(/[\s\n\r]+/g, ''))
            .filter(line => regex.test(line));
        return srcs.reduce((total, currentValue) => {
            let queryStr = null;
            if (hash[currentValue]) {
                queryStr = `?_=${hash[currentValue]}`;
            } else {
                throw Error(`Hash for JavaScript ${currentValue} not found!`);
            }

            return total += outdent`
            <script
                ${options.async ? 'async ' : ''}
                ${options.defer ? 'defer ' : ''}
                src="${pathPrefix}${currentValue}${queryStr}"
            ></script>
            `;
        }, '');
    },

    style: function (content, options = {}) {
        const pathPrefix = '/assets/styles/';
        const regex = RegExp(/^.*\.css/);
        const srcs = content
            .split('\n')
            .map(line => line.replace(/[\s\n\r]+/g, ''))
            .filter(line => regex.test(line));
        return srcs.reduce((total, currentValue) => {
            let queryStr = null;
            if (hash[currentValue]) {
                queryStr = `?_=${hash[currentValue]}`;
            } else {
                throw Error(`Hash for CSS ${currentValue} not found!`);
            }

            return total += outdent`
            <link
                rel="stylesheet"
                href="${pathPrefix}${currentValue}${queryStr}"
                media="${options.media ? options.media : 'screen'}"
            ></link>
            `;
        }, '');
    },

    consoleOutput: function (content, options = {}) {
        const classes = options.classes ? options.classes.join(' ') : '';
        const header = options.header ?
            `<header class="console__header box box--split">
                <span class="console__header-text">${options.header}</span>
                <button class="console__copy-button js-console-btn">Copy</span>
            </header>` :
            '';

        const generateText = content => {
            const regex = RegExp(/[a-zA-z]/);
            return content
                .split('\n')
                .filter(line => regex.test(line))
                .map(line => `<div class="console__line js-console-line">$ ${line}</div>`)
                .join('');
        };

        return outdent`
        <div class="console js-console ${classes}" data-prefix="${options.prefix}">
            ${header}
            <div class="console__lines">
            ${generateText(content)}
            </div>
        </div>
        `;
    }
}