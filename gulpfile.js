const { parallel, src, dest, watch } = require('gulp');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const cleanCSS = require('gulp-clean-css');

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

exports.build = parallel(scripts, styles);
exports.watch = function () {
    watch('src/assets/scripts/*.js', { ignoreInitial: false }, scripts);
    watch('src/assets/styles/*.css', { ignoreInitial: false }, styles);
}