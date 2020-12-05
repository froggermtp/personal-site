const htmlMinfier = require('html-minifier');
const cheerio = require('cheerio');

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

        const $ = cheerio.load(content);
        $('img').map(function (i, el) {
            if (!$(this).attr('loading')) {
                $(this).attr('loading', 'lazy');
            }
        });
        return $.html();
    }
};