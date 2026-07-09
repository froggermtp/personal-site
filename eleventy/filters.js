const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const CleanCSS = require("clean-css");
const Terser = require("terser");

const shouldTransformHTML = process.env.ELEVENTY_ENV === 'production';

const cssCache = new Map();
const jsCache = new Map();

module.exports = {
    cssmin: function (code) {
        if (!shouldTransformHTML) {
            return code;
        }

        if (cssCache.has(code)) {
            return cssCache.get(code);
        }

        const cleanedCss = new CleanCSS({}).minify(code).styles;
        cssCache.set(code, cleanedCss);
        return cleanedCss;
    },

    jsmin: async function (code) {
        if (!shouldTransformHTML) {
            return code;
        }

        if (jsCache.has(code)) {
            return jsCache.get(code);
        }

        const minified = await Terser.minify(code);

        if (minified.error) {
            console.log("Terser error: ", minified.error);
            return code;
        }

        jsCache.set(code, minified.code);
        return minified.code;
    },

    imagePath: function (filename) {
        const basepath = '/assets/images/';
        const filepath = `${basepath}${filename}`;
        const fileContents = fs.readFileSync(path.join(__dirname, `../src/${filepath}`));
        const hash = crypto.createHash('md5').update(fileContents).digest('hex');
        return `${filepath}?_=${hash}`;
    },

    date: function (date, format) {
        if (format === "LL") {
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC'
            }).format(new Date(date));
        }

        if (format === "LLL") {
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                timeZone: 'America/Chicago'
            }).format(new Date(date));
        }

        if (!format) {
            return new Date(date).toISOString().replace(/\.\d{3}Z$/, 'Z');
        }

        throw new Error(`Unsupported date format: ${format}`);
    },

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
}