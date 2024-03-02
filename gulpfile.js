const { src, dest, series, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const sync = require('browser-sync').create()

function libs() {
	return src('src/libs/**')
		.pipe(dest('public/libs'))
}

function js() {
	return src('src/js/**')
		.pipe(dest('public/js'))
}

function fonts() {
	return src('src/fonts/**')
		.pipe(dest('public/fonts'))
}

function html() {
	return src('src/**.html')
		.pipe(include({
			prefix: '@@'
		}))
		.pipe(htmlmin({
			collapseWhitespace: false,
			removeComments: true
		}))
		.pipe(dest('public'))
}

function scss() {
	return src('src/scss/**.scss')
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last  2 versions']
		}))
		.pipe(concat('style.css'))
		.pipe(dest('public/css'))
}

function img() {
	return src('src/img/**')
		.pipe(dest('public/img'))
}

function clear() {
	return del('public')
}

function serve() {
	sync.init({
		server: './public'
	})

	watch('src/**.html', series(html)).on('change', sync.reload)
	watch('src/components/**.html', series(html)).on('change', sync.reload)
	watch('src/js/**.js', series(js, libs)).on('change', sync.reload)
	watch('src/fonts/**', series(fonts))
	watch('src/libs/**', series(libs))
	watch('src/img/**', series(img))
	watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
	watch('src/scss/common/**.scss', series(scss)).on('change', sync.reload)
}

exports.build = series(
	clear,
	scss,
	html,
	img,
	js,
	fonts,
	libs)

exports.serve = series(
	clear,
	scss,
	html,
	img,
	libs,
	js,
	libs,
	fonts,
	serve)

exports.clear = clear

exports.libs = libs