const
    gulp = require('gulp'),
    // JS Minify Start
    pump = require('pump'),
    uglify = require('gulp-uglify'),
    // JS Minify End

    // JS Check Start
    jshint = require('gulp-jshint'),
    // JS Check End

    // SCSS Compiler to CSS Start
    sass = require('gulp-sass'),
    // SCSS Compiler to CSS End

    // CSS Minify Start
    cleanCSS = require('gulp-clean-css'),
    // CSS Minify End

    // HTML Minify Start
    htmlmin = require('gulp-htmlmin'),
    // HTML Minify End

    // CSS Auto Prefix Start
    autoprefixer = require('gulp-autoprefixer'),
    // CSS Auto Prefix End

    // Image Minify Start
    imagemin = require('gulp-imagemin'),
    // Image Minify Start

    // Livereload Start
    connect = require('gulp-connect'),
    livereload = require('gulp-livereload')

// Livereload End

gulp.task('sass', function () {
    return gulp.src('css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(connect.reload());
});

gulp.task('lint', function () {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('minify-js', function (cb) {
    pump([
                gulp.src('js/*.js'),
                uglify(),
                gulp.dest('dist/assets/js')
            ],
            cb
        )
        .pipe(connect.reload())
});

gulp.task('minify-html', function () {
    return gulp.src('*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});


gulp.task('minify-css', () => {
    return gulp.src('css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('minify-image', () =>
    gulp.src('images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/images'))
    .pipe(connect.reload())
);

gulp.task('autoprefixer', () =>
    gulp.src('assets/*.css')
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('dist/prefix'))
);

gulp.task('connect', function () {
    connect.server({
        root: 'dist',
        livereload: true
    });
});
// gulp.task('html', function () {
//     gulp.src('*.html')
//         .pipe(connect.reload());
// });

gulp.task('watch', function () {
    gulp.watch(['*.html'], ['minify-html'])
    gulp.watch(['css/*.scss'], ['sass'])
    gulp.watch(['js/*.js'], ['minify-js'])
    // gulp.watch(['assets/images/*.*'], ['minify-image'])

});

gulp.task('livereload', ['connect', 'watch']);
gulp.task('run-all-task', ["sass", "lint", "minify-js", "minify-html", "connect", "html", "watch"]);

gulp.task('default', ["sass", "lint", "minify-js", "minify-html", "minify-image", "connect", "watch"])