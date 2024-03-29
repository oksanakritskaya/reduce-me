const gulp = require('gulp');
const merge = require('merge-stream');
const streamqueue = require('streamqueue');

const browserSync = require('browser-sync');
const svgSprite = require('gulp-svg-sprite');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const autoprefixer = require('gulp-autoprefixer');
const fileinclude = require('gulp-file-include');

exports.run = function () {
    css_watch();
    svg();
    html();

    browserSync.init({
        server: {
            baseDir: 'src/'
        }
    });

    gulp.watch(['src/styles/*.scss', 'src/styles/**/*.scss'], css_watch);
    gulp.watch('src/images/icons/*.svg', svg);
    gulp.watch(['src/template/*.html', 'src/template/**/*.html'], html);
    gulp.watch('src/*.html').on('change', browserSync.reload);
};

exports.build = function () {
    const css_ouput = streamqueue({objectMode: true},
        css,
        gulp.src(['src/css/*.css', 'src/css/**/*.css']))
        .pipe(gulp.dest('dist/css'));

    const svg_ouput = streamqueue({objectMode: true},
        svg,
        gulp.src('src/images/*.*'))
        .pipe(gulp.dest('dist/images'));

    const html_ouput = streamqueue({objectMode: true},
        html,
        gulp.src('src/*.html'))
        .pipe(gulp.dest('dist'));

    return merge(css_ouput, svg_ouput, html_ouput);
};

function css() {
    return gulp
        .src(['src/styles/*.scss', 'src/styles/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('src/css'));
}

function css_watch() {
    return gulp
        .src('src/styles/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
}

function svg() {
    return gulp
        .src('src/images/icons/*.*')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg"
                }
            },
        }))
        .pipe(gulp.dest('src/images'))
        .pipe(browserSync.stream());
}

function html() {
    return gulp.src(['src/template/**/*', '!src/template/_*/*'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('src/'))
        .pipe(browserSync.stream());
}