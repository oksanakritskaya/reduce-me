const gulp = require('gulp');

const browserSync = require('browser-sync');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

gulp.task('run', function () {
    browserSync.init({
        server: {
            baseDir: 'src/'
        }
    });

    gulp.watch(['src/styles/*.scss', 'src/styles/**/*.scss'], gulp.series('sass'));
    gulp.watch('src/*.html').on('change', browserSync.reload);
});

gulp.task('sass', function () {
    return gulp.src(['src/styles/*.scss', 'src/styles/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
});

gulp.task('build', function () {
    return gulp.src(['src/styles/*.scss', 'src/styles/**/*.scss'], ['sass'])
        .pipe(gulp.dest('dist/styles/'));
});
