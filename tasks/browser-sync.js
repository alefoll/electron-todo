const browserSync = require('browser-sync').create('app');

const Config = require('../electron/Config');

module.exports = (callback) => {

    'use strict';

    const options = {
        open   : false,
        port   : Config.get("global.port"),
        notify : false,
        server : {
            baseDir: "./build"
        }
    };

    browserSync.init(options, (error) => {
        if (error)
            throw new Error(error);

        callback();
    });
};