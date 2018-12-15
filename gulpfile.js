const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify');
const svgmin = require('gulp-svgmin');
const htmlmin = require('gulp-htmlmin');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const mmq = require('gulp-merge-media-queries');
const cssmin = require('gulp-cssmin');
const concat = require('gulp-concat');

const srcPath = './src';
const destPath = './dist';
const prefixBrowsers = ['last 2 version', 'iOS >= 8.1', 'Android >= 4.4'];

gulp.task('sass', () => {
  return gulp
    .src(srcPath + '/sass/**/style.scss')
    .pipe(
      plumber({
        errorHandler: notify.onError('<%= error.message %>'),
      })
    )
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'expanded',
      })
    )
    .pipe(mmq({}))
    .pipe(
      autoprefixer({
        browsers: prefixBrowsers,
        cascade: false,
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(destPath + '/css'))
    .pipe(browserSync.stream());
});

gulp.task('sass-min', () => {
  return gulp
    .src(srcPath + '/sass/**/style.scss')
    .pipe(
      plumber({
        errorHandler: notify.onError('<%= error.message %>'),
      })
    )
    .pipe(
      sass({
        outputStyle: 'expanded',
      })
    )
    .pipe(mmq({}))
    .pipe(
      autoprefixer({
        browsers: prefixBrowsers,
        cascade: false,
      })
    )
    .pipe(cssmin())
    .pipe(gulp.dest(destPath + '_min/css'))
    .pipe(browserSync.stream());
});

gulp.task('js', () => {
  return gulp
    .src(srcPath + '/js/**/*.js')
    .pipe(
      plumber({
        errorHandler: notify.onError('<%= error.message %>'),
      })
    )
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(destPath + '/js'))
    .pipe(browserSync.stream());
});

gulp.task('js-min', () => {
  return gulp
    .src(srcPath + '/js/**/*.js')
    .pipe(
      plumber({
        errorHandler: notify.onError('<%= error.message %>'),
      })
    )
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(destPath + '_min/js'))
    .pipe(browserSync.stream());
});

gulp.task('html', () => {
  return gulp
    .src(srcPath + '/**/*.html')
    .pipe(
      plumber({
        errorHandler: notify.onError('<%= error.message %>'),
      })
    )
    .pipe(gulp.dest(destPath))
    .pipe(browserSync.stream());
});

gulp.task('html-min', () => {
  return gulp
    .src(srcPath + '/**/*.html')
    .pipe(
      plumber({
        errorHandler: notify.onError('<%= error.message %>'),
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(gulp.dest(destPath + '_min'))
    .pipe(browserSync.stream());
});

gulp.task('svg', () => {
  return gulp
    .src(srcPath + '/svg/**/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest(destPath + '/img'));
});

gulp.task('svg-min', () => {
  return gulp
    .src(srcPath + '/svg/**/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest(destPath + '_min/img'));
});

gulp.task('copy-direct', () => {
  return gulp
    .src(['./static/**/*', './static/**/.htaccess'], { base: 'static' })
    .pipe(gulp.dest(destPath));
});

gulp.task('copy-direct-min', () => {
  return gulp
    .src(['./static/**/*', './static/**/.htaccess'], { base: 'static' })
    .pipe(gulp.dest(destPath + '_min'));
});

gulp.task(
  'build',
  gulp.parallel('sass-min', 'js-min', 'html-min', 'copy-direct-min', 'svg-min')
);

gulp.task('serve', () => {
  browserSync.init({
    server: destPath,
  });
  gulp.watch(destPath + '/**/*.html').on('change', browserSync.reload);
});

gulp.task(
  'watch',
  gulp.series(
    gulp.parallel('sass', 'js', 'html', 'copy-direct', 'svg'),
    'serve',
    () => {
      gulp.watch(srcPath + '/sass/**/*.scss', gulp.task('sass'));
      gulp.watch(srcPath + '/js/**/*.js', gulp.task('js'));
      gulp.watch(srcPath + '/**/*.html', gulp.task('html'));
      gulp.watch(
        ['./static/**/*', './static/**/.htaccess'],
        gulp.task('copy-direct')
      );
    }
  )
);

gulp.task('default', gulp.parallel('watch'));
