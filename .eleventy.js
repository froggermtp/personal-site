module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({ "public/img": "img" });
    eleventyConfig.addPassthroughCopy({ "public/css": "css" });

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