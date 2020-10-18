const pluginYoutube = require("eleventy-plugin-youtube-embed");
const pluginRSS = require("@11ty/eleventy-plugin-rss");
const pluginTypeset = require("eleventy-plugin-typeset");
const pluginLazyImages = require("eleventy-plugin-lazyimages");
const markdownIt = require("markdown-it");
const markdownItFootnote = require("markdown-it-footnote");
const nunjucks = require('nunjucks');
const pairedShortcodes = require("./utils/pairedShortcodes.js");

module.exports = function (config) {
    // Nunjucks
    const loaders = [
        new nunjucks.FileSystemLoader('src/layouts'),
        new nunjucks.FileSystemLoader('src/includes'),
        new nunjucks.FileSystemLoader('src/assets/styles'),
        new nunjucks.FileSystemLoader('src/assets/scripts'),
    ];
    const nunjucksEnvironment = new nunjucks.Environment(loaders);
    config.setLibrary("njk", nunjucksEnvironment);


    // Plugins
    config.addPlugin(pluginYoutube, { only: '.articleContent' });
    config.addPlugin(pluginRSS);
    config.addPlugin(pluginTypeset({ only: '.articleContent p' }));
    config.addPlugin(pluginLazyImages);

    // Filters
    const filters = require('./utils/filters.js')(nunjucksEnvironment);
    Object.keys(filters).forEach(filterName => {
        config.addFilter(filterName, filters[filterName]);
    });

    // Paired Shortcodes
    Object.keys(pairedShortcodes).forEach(pairedShortcodeName => {
        config.addPairedShortcode(pairedShortcodeName, pairedShortcodes[pairedShortcodeName]);
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
    config.addPassthroughCopy('src/assets/images');

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