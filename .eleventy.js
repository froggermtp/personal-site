module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("views/img");
    eleventyConfig.addPassthroughCopy("views/css");

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