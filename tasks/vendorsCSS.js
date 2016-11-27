const gulp = require('gulp');

const concat = require('gulp-concat');
const gutil  = require('gulp-util');

const browserSync = require('browser-sync');

module.exports = () => {
    'use strict';

    const dependencies = './node_modules';

    return gulp.src([
        dependencies + '/normalize.css/normalize.css',
        dependencies + '/angular-material/angular-material.css'
    ])
    .pipe(concat('vendors.css', { newLine: "\n" }))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.has('app') ? browserSync.get('app').reload({ stream: true }) : gutil.noop());
};