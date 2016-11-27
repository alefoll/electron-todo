const { spawn } = require('child_process');
const electron  = require('electron');

const gutil = require('gulp-util');

module.exports = () => {
    'use strict';

    let electronSpawn;

    if (gutil.env.prod)
        electronSpawn = spawn(electron, ['.']);
    else
        electronSpawn = spawn(electron, ['.', '--test']);

    electronSpawn.stdout.on('data', (data) => {
        console.log(`${data}`);
    });

    electronSpawn.stderr.on('data', (data) => {
        console.log(`${data}`);
    });

    electronSpawn.on('close', () => {
    });
};