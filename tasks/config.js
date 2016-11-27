const gulp = require('gulp');

module.exports = () => {
    'use strict';

    return gulp.src([
        'config.json'
    ])
    .pipe(gulp.dest('webapp-win32-ia32/resources'))
};