const gulp = require('gulp');

const concat     = require('gulp-concat');
const gutil      = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const uglify     = require('gulp-uglify');

const browserSync = require('browser-sync');

module.exports = () => {
    'use strict';

    const dependencies = './node_modules';

    return gulp.src([
        dependencies + '/angular/angular.js',
        dependencies + '/angular-aria/angular-aria.js',
        dependencies + '/angular-animate/angular-animate.js',
        dependencies + '/angular-material/angular-material.js'
    ])
    .pipe(concat('vendors.min.js', { newLine: "\n" }))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.has('app') ? browserSync.get('app').reload({ stream: true }) : gutil.noop());
};