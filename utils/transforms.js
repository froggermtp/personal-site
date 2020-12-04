const htmlMinfier = require('html-minifier');

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
    }
};