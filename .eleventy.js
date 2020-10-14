const pluginYoutube = require("eleventy-plugin-youtube-embed");
const pluginRSS = require("@11ty/eleventy-plugin-rss");
const pluginTypeset = require("eleventy-plugin-typeset");
const pluginLazyImages = require("eleventy-plugin-lazyimages");
const markdownIt = require("markdown-it");
const markdownItFootnote = require("markdown-it-footnote");

const filters = require('./utils/filters.js');

module.exports = function (config) {
    // Plugins
    config.addPlugin(pluginYoutube, { only: '.articleContent' });
    config.addPlugin(pluginRSS);
    config.addPlugin(pluginTypeset({ only: '.articleContent p' }));
    config.addPlugin(pluginLazyImages, {
        transformImgPath: (src) => {
            items = src.split("\\");
            index = items.indexOf("img") - 1;
            items.splice(index, 0, "public");
            return items.join("\\");
        }
    });

    // Filters
    Object.keys(filters).forEach(filterName => {
        config.addFilter(filterName, filters[filterName]);
    });

    // Markdown
    config.setLibrary(
        'md',
        markdownIt({
            html: true
        })
            .use(markdownItFootnote)
    );

    // Pass-through files
    config.addPassthroughCopy({ "public/img": "img" });
    config.addPassthroughCopy({ "public/pdf": "pdf" });
    config.addPassthroughCopy({ "public/robots.txt": "robots.txt" });

    // Collections
    config.addCollection('postInfo', function (collection) {
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

    // Base config
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