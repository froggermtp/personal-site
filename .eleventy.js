const CleanCSS = require("clean-css");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({ "public/img": "img" });
    eleventyConfig.addPassthroughCopy({ "public/js": "js" });

    eleventyConfig.addFilter("cssmin", function (code) {
        return new CleanCSS({}).minify(code).styles;
    });

    eleventyConfig.addFilter('dateReadable', function (date) {
        return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
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