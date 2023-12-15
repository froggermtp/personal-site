const moment = require('moment');
const hash = require('../src/data/hash.json');

module.exports = function (nunjucksEnv) {
    const filters = {
        scriptPath: function (filename) {
            if (!hash[filename]) {
                throw Error(`Hash for JavaScript ${filename} not found!`);
            }

            const basepath = '/assets/scripts/';
            return `${basepath}${filename}?_=${hash[filename]}`;
        },

        stylePath: function (filename) {
            if (!hash[filename]) {
                throw Error(`Hash for CSS ${filename} not found!`);
            }

            const basepath = '/assets/styles/';
            return `${basepath}${filename}?_=${hash[filename]}`;
        },

        imagePath: function (filename) {
            if (!hash[filename]) {
                throw Error(`Hash for image ${filename} not found!`);
            }

            const basepath = '/assets/images/';
            return `${basepath}${filename}?_=${hash[filename]}`;
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
        },

        unique: function (arr) {
            return arr.filter((value, index, array) => array.indexOf(value) === index);
        },

        mapGetAttr: function (arr, attr) {
            return arr.map(i => i[attr]);
        },

        flatten: function (arr) {
            return arr.flat(1);
        }
    };

    return filters;
}