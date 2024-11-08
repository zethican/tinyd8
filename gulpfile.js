const { series, parallel, src, dest, watch } = require('gulp');

const concat = require('gulp-concat');
const nano = require('gulp-clean-css');
const sass = require('gulp-sass');

const paths = {
    css: [ "scss/tinyd8.scss" ]
};

const buildPaths = {
    css: "css"
}

function css()
{
    return src(paths.css)
        .pipe(concat('tinyd8.css'))
        .pipe(sass())
        .pipe(nano())
        .pipe(dest(buildPaths.css));
}

exports.css = series(css);