const gulp = require('gulp');

const gutil = require('gulp-util');

const browserSync = require('browser-sync');

module.exports = () => {
    'use strict';

    return gulp.src([
        'src/assets/**/*',
        'src/default.json',
    ], { base: 'src' })
    .pipe(gulp.dest('build'))
    .pipe(browserSync.has('app') ? browserSync.get('app').reload({ stream: true }) : gutil.noop());
};