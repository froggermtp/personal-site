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

    // Layouts
    config.addLayoutAlias('main', 'main-layout.njk');
    config.addLayoutAlias('post', 'post-layout.njk');
    config.addLayoutAlias('about', 'about-layout.njk');

    // Pass-through files
    config.addPassthroughCopy({ "src/assets/images": "img" });

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
        templateFormats: ['md', 'njk',],
        dir: {
            input: 'src',
            output: 'dist',
            includes: 'includes',
            layouts: 'layouts',
            data: 'data',
        }
    };
};