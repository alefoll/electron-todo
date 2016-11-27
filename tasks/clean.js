const del = require('del');

module.exports = () => {
    'use strict';

    return del(['build/**', 'electron-todo-*/**']);
};