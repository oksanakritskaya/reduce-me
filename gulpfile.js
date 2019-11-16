const gulp = require('gulp');

const browserSync = require('browser-sync');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const fileinclude = require('gulp-file-include');

exports.run = function () {
    browserSync.init({
        server: {
            baseDir: 'src/'
        }
    });

    gulp.watch(['src/styles/*.scss', 'src/styles/**/*.scss'], scss_watch);
    gulp.watch(['src/template/*.html', 'src/template/**/*.html'], html_watch);
    gulp.watch('src/**/*.svg').on('change', browserSync.reload);
};

exports.build = gulp.series(scss, html, function () {
    return gulp
        .src('src/**/*.svg')
        .pipe(gulp.dest('dist/'));
});

function html() {
    return gulp.src(['src/template/*.html', 'src/template/**/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('src/'))
        .pipe(gulp.dest('dist/'));
}

function html_watch() {
    return gulp.src(['src/template/*.html', 'src/template/**/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('src/'))
        .pipe(browserSync.stream());
}

function scss() {
    return gulp
        .src(['src/styles/*.scss', 'src/styles/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/css'))
        .pipe(gulp.dest('dist/css'));
}

function scss_watch() {
    return gulp
        .src(['src/styles/*.scss', 'src/styles/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
}