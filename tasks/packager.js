const packager = require('electron-packager');

module.exports = (done) => {
    'use strict';

    const options = {
        arch: 'ia32',
        dir: '.',
        platform: 'win32',
        asar: true,
        prune: true,
        icon: 'build/assets/logo.ico',
        ignore: [
            '.editorconfig',
            '.eslintrc.json',
            '.gitignore',
            'GulpFile.js',
            'README.md',
            'config.json',
            'src/',
            'tasks/',
            'yarn.lock'
        ]
    }

    packager(options, (error, appPaths) => {
        console.log(error);
        console.log(appPaths);
        done();
    })
};