var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	livereload = require('gulp-livereload'),
	connect = require('gulp-connect'),
	del = require('del');


gulp.task('webserver', function() {
	connect.server({
		livereload: true
	});
});

gulp.task('styles', function() {
	return gulp.src('style.scss')
	.pipe(sass({ style: 'expanded' }))
	.pipe(autoprefixer())
	.pipe(gulp.dest('dist/css'))
	.pipe(rename({suffix: '.min'}))
	.pipe(minifycss())
	.pipe(gulp.dest('dist/css'))
	//.pipe(notify({ message: 'Styles task complete' }))
	.pipe(connect.reload());
});

gulp.task('js', function() {
	return gulp.src('app.js')
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    //.pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    //.pipe(notify({ message: 'JS task complete' }))
    .pipe(connect.reload());
});

gulp.task('images', function() {
	return gulp.src('images/*.jpg')
	.pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
	.pipe(gulp.dest('dist/img'))
	//.pipe(notify({ message: 'Images task complete' }))
	.pipe(connect.reload());
});

gulp.task('clean', function(cb) {
	del(['dist/css', 'dist/js', 'dist/img'], cb)
});

gulp.task('watch', function() {
	gulp.watch('style.scss', ['styles']);
	gulp.watch('app.js', ['js']);
	gulp.watch('images/*', ['images']);
});

gulp.task('default', ['styles', 'js', 'images', 'webserver', 'watch']);
