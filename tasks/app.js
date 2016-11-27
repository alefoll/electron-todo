const gulp = require('gulp');

const concat     = require('gulp-concat');
const eslint     = require('gulp-eslint');
const gutil      = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const uglify     = require('gulp-uglify');

const browserSync = require('browser-sync');

module.exports = () => {
    'use strict';

    return gulp.src([
        'src/js/**/*.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(concat('app.min.js', { newLine: "\n" }))
    .pipe(sourcemaps.init())
    .pipe(gutil.env.prod ? uglify() : gutil.noop())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.has('app') ? browserSync.get('app').reload({ stream: true }) : gutil.noop())
};