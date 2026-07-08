const htmlMinfier = require('html-minifier-terser');
const htmlParser = require('node-html-parser');
const typeset = require('../vendor/typeset');

function shouldTransformHtml(outputPath) {
    return outputPath &&
        outputPath.endsWith('.html') &&
        process.env.ELEVENTY_ENV === 'production';
}

module.exports = {
    htmlmin: async function (content, outputPath) {
        if (!shouldTransformHtml(outputPath)) {
            return content;
        }

        return await htmlMinfier.minify(content, {
            useShortDoctype: true,
            removeComments: true,
            collapseWhitespace: true,
        });
    },

    lazyLoadImages: function (content, outputPath) {
        if (!outputPath.endsWith('.html')) {
            return content;
        }

        const root = htmlParser.parse(content);
        root.querySelectorAll('img').forEach(function(el) {
            if (el.getAttribute('loading')) {
                return;
            }
            el.setAttribute('loading', 'lazy');
        });
        return root.toString();
    },

    typeset: function (content, outputPath) {
        if (outputPath && outputPath.endsWith('.html')) {
            return typeset(content, { only: '.articleContent p' });
        }

        return content;
    }
};