const pluginRSS = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginTypeset = require("eleventy-plugin-typeset");
const markdownIt = require("markdown-it");
const markdownItFootnote = require("markdown-it-footnote");
const markdownItMathjax = require('@area403/markdown-it-mathjax');

const filters = require('./eleventy/filters.js');
const pairedShortcodes = require("./eleventy/pairedShortcodes.js");
const transforms = require('./eleventy/transforms.js');

module.exports = function (config) {
    // Plugins
    config.addPlugin(pluginRSS);
    config.addPlugin(pluginTypeset({ only: '.articleContent p' }));
    config.addPlugin(pluginSyntaxHighlight);
        
    // Filters
    Object.keys(filters).forEach(filterName => {
        const fn = filters[filterName];
        if (fn.constructor.name == 'AsyncFunction') {
            config.addAsyncFilter(filterName, fn);
        } else {
            config.addFilter(filterName, fn);
        }
    });

    // Paired Shortcodes
    Object.keys(pairedShortcodes).forEach(pairedShortcodeName => {
        config.addPairedShortcode(pairedShortcodeName, pairedShortcodes[pairedShortcodeName]);
    });

    // Transforms
    Object.keys(transforms).forEach(transformName => {
        config.addTransform(transformName, transforms[transformName]);
    });

    // Markdown
    config.setLibrary(
        'md',
        markdownIt({
            html: true
        })
            .disable('code')
            .use(markdownItFootnote)
            .use(markdownItMathjax)
    );

    config.setDataDeepMerge(true);

    // Pass-through files
    config.addPassthroughCopy({'src/assets/images': 'assets/images'});
    config.addPassthroughCopy({'src/assets/fonts': 'assets/fonts'});

    // Extra watch targets
    config.addWatchTarget("./src/assets/**/*");

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
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dir: {
            input: 'src/views',
            output: 'dist',
            includes: '../includes',
            layouts: '../layouts',
            data: '../data',
        }
    };
};