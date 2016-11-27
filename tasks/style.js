const gulp = require('gulp');

const autoprefixer = require('autoprefixer');
const concat       = require('gulp-concat');
const gutil        = require('gulp-util');
const postcss      = require('gulp-postcss');

const browserSync = require('browser-sync');

module.exports = () => {
    'use strict';

    return gulp.src([
        'src/css/*.css'
    ])
    .pipe(postcss([
        autoprefixer()
    ]))
    .pipe(concat('style.css', { newLine: "\n" }))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.has('app') ? browserSync.get('app').reload({ stream: true }) : gutil.noop());
};