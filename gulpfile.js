const gulp = require('gulp');
const merge = require('merge-stream');
const streamqueue = require('streamqueue');

const browserSync = require('browser-sync');
const svgSprite = require('gulp-svg-sprite');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const fileinclude = require('gulp-file-include');

exports.run = function () {
    css();
    svg();
    html();

    browserSync.init({
        server: {
            baseDir: 'src/'
        }
    });

    gulp.watch(['src/styles/*.scss', 'src/styles/**/*.scss'], css);
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

    return merge(
        css_ouput,
        svg_ouput,
        gulp.src('src/*.html')
            .pipe(gulp.dest('dist'))
    );
};

function css() {
    return gulp
        .src(['src/styles/*.scss', 'src/styles/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
}

function svg() {
    return gulp
        .src('src/images/icons/*.svg')
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
    return gulp.src(['src/template/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('src/'))
        .pipe(browserSync.stream());
}