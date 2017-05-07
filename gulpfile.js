var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();


gulp.task('sass', function(){
    return gulp.src('scss/main.scss')
            .pipe(sass())
            .pipe(gulp.dest('app/css'))
            .pipe(browserSync.stream());
});

gulp.task('js', function () {
    // app.js is your main JS file with all your module inclusions
    return browserify({ entries: './src/app.js', debug: true })
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./app/dist'));
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['sass','js'], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: "./app",
        host: "10.0.0.7",
        notify: true
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("scss/**/*.scss", ['sass']);
    gulp.watch("src/*.js", ['js-watch']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});