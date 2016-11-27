const gulp = require('gulp');

module.exports = () => {
    'use strict';

    return gulp.src([
        'config.json'
    ])
    .pipe(gulp.dest('electron-todo-win32-ia32/resources'))
};