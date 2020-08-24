const gulp = require('gulp');
const concat = require('gulp-concat');
const html = require('gulp-file-include');
const del = require('del');
const htmlbeautify = require('gulp-html-beautify');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');


/* scss TASK*/
function scss() {
	return gulp.src('src/scss/**/*.scss')
		// style.css 파일 하나로 할 경우
		// .pipe(sass.sync().on('error', sass.logError))
		// .pipe(combine())
		// .pipe(concat('style.scss'))

		.pipe(sass.sync().on('error', sass.logError))
		.pipe(gulp.dest('./dist/css'))
}

function htmlInclude() {
	let source = 'src/html/include/*.html';
	return gulp.src(source)
		.pipe(html())
		.pipe(gulp.dest('dist/html/include'))
}

function htmlPage() {
	if (process.env.NODE_ENV == 'product') {
		gulp.src('src/html/include/head.html')
			.pipe(replace('bootstrap.css', 'bootstrap.min.css'))
			.pipe(gulp.dest('src/html/include/'));
	} else if (process.env.NODE_ENV == 'develope') {
		gulp.src('src/html/include/head.html')
			.pipe(replace('bootstrap.min.css', 'bootstrap.css'))
			.pipe(gulp.dest('src/html/include/'));
	}
	return gulp.src('src/html/*.html')
		.pipe(html())
		.pipe(gulp.dest('dist/html/'))
}

function copyCss() {
	gulp.src(['src/css/dist/bootstrap.min.css', 'src/css/dist/bootstrap.min.css.map'])
		.pipe(gulp.dest('dist/css'));
	return gulp.src('src/css/dist/fonts/**',)
		.pipe(gulp.dest('dist/css/fonts'));
}

function copyImg() {
	return gulp.src('src/img/**/**')
		.pipe(gulp.dest('dist/img'));
}

function copyFonts() {
	return gulp.src('src/fonts/**/**')
		.pipe(gulp.dest('dist/fonts'));
}

function jsLib() {
	let sourceLib = [
		'src/js/src/jquery.js',
		'src/js/src/bootstrap.min.js',
		'src/js/src/bootstrap-datepicker.js',
		'src/js/src/bootstrap-datepicker.ko.min.js'
	];
	return gulp.src(sourceLib)
		.pipe(concat('bundle.js'))
		.pipe(gulp.dest('dist/js'))
}

function jsCommon() {
	let sourceUi = ['src/js/ui/*.js'];
	return gulp.src(sourceUi)
		.pipe(concat('common.js'))
		.pipe(gulp.dest('dist/js'))
}

function watchScss() {
	gulp.watch('src/scss/**/*.scss', gulp.series(scss));
}

function watchHtml() {
	gulp.watch(['src/html/*.html'], gulp.series(htmlPage));
}

function watchInclude() {
	gulp.watch('src/html/include/*.html', gulp.series(htmlInclude, htmlPage));
	gulp.watch('src/html/partial/*.html', gulp.series(htmlInclude, htmlPage));
	gulp.watch('src/html/layer/*.html', gulp.series(htmlInclude, htmlPage));
}

function watchJs() {
	gulp.watch('src/js/*/*.js', gulp.series(jsLib, jsCommon));
}

function watchImg() {
	gulp.watch('src/img/**/*', gulp.series(copyImg));
}

function watchFont() {
	gulp.watch('src/fonts/**/**', gulp.series(copyFonts));
}


function beautify() {
	var options = {
		indentSize: 4
	}
	return gulp.src('./dist/html/*.html')
		.pipe(htmlbeautify(options))
		.pipe(gulp.dest('./dist/html/'))
}

function delDist() {
	return del('dist');
}

function setEnvProduct(cb) {
	process.env.NODE_ENV = 'product';
	cb();
}

function setEnvDevelope(cb) {
	process.env.NODE_ENV = 'develope'
	cb();
}


//task
gulp.task("dev", gulp.series(setEnvDevelope, delDist, scss, copyImg, copyFonts, jsLib, jsCommon, htmlPage));
gulp.task("dist", gulp.series(setEnvProduct, delDist, copyCss, copyImg, copyFonts, jsLib, jsCommon, htmlPage, beautify));
gulp.task("watch", gulp.parallel(watchScss, watchHtml, watchInclude, watchJs, watchImg, watchFont));


exports.default = gulp.series("dist");



