const CleanCSS = require("clean-css");
const Terser = require("terser");
const moment = require('moment');

const cssCache = new Map();
const jsCache = new Map();

module.exports = function (nunjucksEnv) {
    const filters = {
        cssmin: function (code) {
            if (cssCache.has(code)) {
                return cssCache.get(code);
            }

            const cleanedCss = new CleanCSS({}).minify(code).styles;
            cssCache.set(code, cleanedCss);
            return cleanedCss;
        },

        jsmin: function (code) {
            if (jsCache.has(code)) {
                return jsCache.get(code);
            }

            const minified = Terser.minify(code);

            if (minified.error) {
                console.log("Terser error: ", minified.error);
                return code;
            }

            jsCache.set(code, minified.code);
            return minified.code;
        },

        date: function (date, format) {
            return moment.utc(date).format(format);
        },

        postPreview: (function () {
            const striptags = nunjucksEnv.getFilter('striptags');
            const truncate = nunjucksEnv.getFilter('truncate');
            const replace = nunjucksEnv.getFilter('replace');

            return postText => {
                const step1 = filters.removeFootnote(postText);
                const step2 = striptags(step1, true);
                const step3 = truncate(step2, 280);
                const step4 = replace(step3, '&quot;', '"');
                return step4;
            }
        })(),

        removeFootnote: function (str) {
            const regex = /\[.+\]/g
            return str.replace(regex, "");
        }
    };

    return filters;
}