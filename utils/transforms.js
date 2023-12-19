const htmlMinfier = require('html-minifier');
const htmlParser = require('node-html-parser');

function shouldTransformHtml(outputPath) {
    return outputPath &&
        outputPath.endsWith('.html') &&
        process.env.ELEVENTY_ENV === 'production';
}

module.exports = {
    htmlmin: function (content, outputPath) {
        if (!shouldTransformHtml(outputPath)) {
            return content;
        }

        return htmlMinfier.minify(content, {
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
    }
};