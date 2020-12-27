const { parallel, src, dest, watch } = require('gulp');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const cleanCSS = require('gulp-clean-css');
const through2 = require('through2');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function scripts(cb) {
    return src('src/assets/scripts/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(terser())
        .pipe(dest('dist/assets/scripts'));
}

function styles(cb) {
    return src('src/assets/styles/*.css')
        .pipe(cleanCSS())
        .pipe(dest('dist/assets/styles'));
}

function hashAssets(cb) {
    function hash() {
        return through2.obj((chunk, enc, cb) => {
            chunk.contents = crypto
                .createHash('md5')
                .update(chunk.contents)
                .digest();
            cb(null, chunk);
        });
    }

    function toJson() {
        let obj = {};
        return through2.obj(
            (chunk, enc, cb) => {
                const { name, ext } = path.parse(chunk.path);
                obj[`${name}${ext}`] = chunk.contents.toString('base64');
                cb(null, null);
            },
            function (cb) {
                this.push(JSON.stringify(obj));
                cb();
            }
        );
    }

    return src([
        'src/assets/scripts/*.js',
        'src/assets/styles/*.css',
        'src/assets/images/*'
    ])
        .pipe(hash())
        .pipe(toJson())
        .pipe(fs.createWriteStream('src/data/hash.json'));
}

exports.build = parallel(hashAssets, scripts, styles);
exports.hashAssets = hashAssets;
exports.watch = function () {
    watch('src/assets/scripts/*.js', { ignoreInitial: false }, scripts);
    watch('src/assets/styles/*.css', { ignoreInitial: false }, styles);
}