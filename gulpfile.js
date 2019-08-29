const gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    postcss = require("gulp-postcss"),
    autoPrefix = require('autoprefixer'),
    cssNano = require("cssnano");

function html(){
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./build'));
}

function reload(done) {
    browserSync.reload();
    done();
}

function style() {
    return gulp.src('./src/styles/main.scss')
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(gulp.dest('./src/css'))
        .pipe(browserSync.stream());
}

function watch(){
    style();
    browserSync.init(
        {
            server: {
                baseDir: "./src",
                index: "index.html"
            }
        }
    );
    gulp.watch("./src/styles/**/*.scss", style);
    gulp.watch("./src/*.html", reload);
}

function styleBuild() {
    return gulp.src('./src/css/main.css')
        .pipe(postcss([autoPrefix(), cssNano()]))
        .pipe(gulp.dest('./build/styles'))
}

function clean(){
    return del('./build/*');
}

let build = gulp.series(clean, gulp.parallel(styleBuild, html));

gulp.task('build', build);
gulp.task('watch', watch);
