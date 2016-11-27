const gulp = require('gulp');

const gutil = require('gulp-util');

const browserSync = require('browser-sync');

module.exports = () => {
    'use strict';

    return gulp.src('src/*.html')
        .pipe(gulp.dest('build'))
        .pipe(browserSync.has('app') ? browserSync.get('app').reload({ stream: true }) : gutil.noop());
};