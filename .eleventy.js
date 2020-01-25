const CleanCSS = require("clean-css");
const Terser = require("terser");
const moment = require('moment');

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({ "public/img": "img" });
    eleventyConfig.addPassthroughCopy({ "public/pdf": "pdf" });

    eleventyConfig.addFilter("cssmin", function (code) {
        return new CleanCSS({}).minify(code).styles;
    });

    eleventyConfig.addFilter("jsmin", function (code) {
        let minified = Terser.minify(code);
        if (minified.error) {
            console.log("Terser error: ", minified.error);
            return code;
        }

        return minified.code;
    });

    eleventyConfig.addFilter('date', function (date, format) {
        return moment.utc(date).format(format);
    });

    eleventyConfig.addCollection('postInfo', function (collection) {
        const posts = collection.getFilteredByTag('post');
        let postInfo = {};

        for (let ii = 0; ii < posts.length; ii++) {
            let previousUrl = ii - 1 > -1 ? posts[ii - 1].url : undefined;
            let previousTitle = ii - 1 > -1 ? posts[ii - 1].data.title : undefined;
            let nextUrl = ii + 1 < posts.length ? posts[ii + 1].url : undefined;
            let nextTitle = ii + 1 < posts.length ? posts[ii + 1].data.title : undefined;
            postInfo[posts[ii].url] = { previousUrl, previousTitle, nextUrl, nextTitle };
        }

        return postInfo;
    });

    return {
        templateFormats: [
            "md",
            "njk"
        ],
        dir: {
            input: "views"
        }
    };
};