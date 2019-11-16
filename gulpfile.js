const gulp = require('gulp');

const browserSync = require('browser-sync');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

exports.run = function () {
    browserSync.init({
        server: {
            baseDir: 'src/'
        }
    });

    gulp.watch(['src/styles/*.scss', 'src/styles/**/*.scss'], scss_watch);
    gulp.watch('src/*.html').on('change', browserSync.reload);
};

exports.build = gulp.series(scss, function () {
    return gulp
        .src(['src/**/*.svg', 'src/*.html'])
        .pipe(gulp.dest('dist/'));
});

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