'use strict';

const gulp         = require('gulp'),
      sass         = require('gulp-sass'),
      concat       = require('gulp-concat'),
      sourcemaps   = require('gulp-sourcemaps'),
      autoprefixer = require('gulp-autoprefixer'),
      rename       = require('gulp-rename'),
      babel        = require('gulp-babel'),
      flatten      = require('gulp-flatten'),
      runSequence  = require('run-sequence').use(gulp),
      browserSync  = require('browser-sync').create(),
      del          = require('del');

gulp.task('clean', () => {
    return del.sync(['dist/js/**', 'dist/css/**']);
})

gulp.task('html', () => {
    return gulp.src('src/**/*.html')
        .pipe(flatten())
        .pipe(gulp.dest('./dist'))
})

gulp.task('sass', () => {
  return gulp.src(['./src/styles/App.sass'])
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('styles.css'))
      .pipe(autoprefixer())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./dist/css'));
})


gulp.task('js', () => {
    return gulp.src('src/app/**/*.js')
        .pipe(sourcemaps.init())
        // .pipe(babel({
        //     presets: ['env']
        // }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js'))
});

gulp.task('watch', () => {
    gulp.watch(['./src/**/*.js'], ['js', 'reload']);
    gulp.watch(['./src/**/*.html'], ['html', 'reload']);
    gulp.watch(['./src/**/*.sass', './src/**/*.scss'], ['stream']);
})

gulp.task('serve', () => {
  browserSync.init({
      server: {
          baseDir: "./dist/"
      }
  });
});

gulp.task('reload', (done) => {
    browserSync.reload();
    done();
});

gulp.task('stream', ['sass'], (done) => {
    browserSync.reload('styles.css');
    done();
});

gulp.task('default',(cb) => {
    runSequence('clean', 'html', 'sass', 'js', 'serve', 'watch');
});
