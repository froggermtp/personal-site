const moment = require('moment');

const shouldTransformHTML = process.env.ELEVENTY_ENV === 'production';

module.exports = function (nunjucksEnv) {
    const filters = {
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