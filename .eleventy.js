module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({ "public/img": "img" });
    eleventyConfig.addPassthroughCopy({ "public/css": "css" });
    eleventyConfig.addPassthroughCopy({ "public/js": "js" });

    eleventyConfig.addFilter('dateReadable', function (date) {
        return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
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