const outdent = require('outdent');

module.exports = {
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
    },
    highlightCode: function(content) {
        return outdent`<code class="highlight highlight__code">${content}</code>`;
    }
}