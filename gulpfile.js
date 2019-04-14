const
    gulp = require('gulp'),
    // JS Minify 
    pump = require('pump'),
    uglify = require('gulp-uglify'),
    // JS Check 
    jshint = require('gulp-jshint'),
    // SCSS Compiler to CSS 
    sass = require('gulp-sass'),
    // CSS Minify 
    cleanCSS = require('gulp-clean-css'),
    // HTML Minify 
    htmlmin = require('gulp-htmlmin'),
    // CSS Auto Prefix
    autoprefixer = require('gulp-autoprefixer'),
    // Image Minify 
    imagemin = require('gulp-imagemin'),
    // Livereload 
    connect = require('gulp-connect');

gulp.task('sass', function () {
    return gulp.src('workspace/assets/css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('workspace/assets/css'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(connect.reload());
});

gulp.task('lint', function () {
    return gulp.src('workspace/assets/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('minify-js', function (cb) {
    pump([
            gulp.src('workspace/assets/js/*.js'),
            uglify(),
            gulp.dest('dist/assets/js')
        ], cb)
        .pipe(connect.reload())
});

gulp.task('minify-html', function () {
    return gulp.src('workspace/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});


gulp.task('minify-css', () => {
    return gulp.src('workspace/assets/css/*.css')
        .pipe(cleanCSS())
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(connect.reload());
});

gulp.task('minify-image', () =>
    gulp.src('workspace/assets/imgs/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/imgs'))
    .pipe(connect.reload())
);

gulp.task('copy', function () {
    return gulp.src('src/assets/fonts/*.*')
        .pipe(gulp.dest('dist/assets/fonts'))
});

gulp.task('fonts', function () {
    gulp.src('workspace/assets/fonts/*.*')
        .pipe(gulp.dest('dist/assets/fonts'));
})

gulp.task('dev', function () {
    connect.server({
        name: 'Dev App',
        root: 'workspace',
        port: 8080,
        livereload: true
    });
});

gulp.task('prod', function () {
    connect.server({
        name: 'Prod App',
        root: 'dist',
        port: 8081,
        livereload: true
    });
});

gulp.task('watch', function () {
    gulp.watch(['workspace/*.html'], ['minify-html'])
    gulp.watch(['workspace/assets/css/*.scss'], ['sass'])
    gulp.watch(['workspace/assets/css/*.css'], ['minify-css'])
    gulp.watch(['workspace/assets/js/*.js'], ['minify-js'])
    gulp.watch(['workspace/assets/imgs/*.*'], ['minify-image'])

});

gulp.task('default', ["lint", "minify-js", 'minify-css', "minify-html", "minify-image", "fonts", "prod", "dev", "watch"]);
gulp.task('sass', ["sass", "lint", "minify-js", 'minify-css', "minify-html", "minify-image", "fonts", "prod", "dev", "watch"]);
