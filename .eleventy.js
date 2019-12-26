module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({ "public/img": "img" });
    eleventyConfig.addPassthroughCopy({ "public/css": "css" });
    eleventyConfig.addPassthroughCopy({ "public/js": "js" });

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