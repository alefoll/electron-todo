const path = require('path');

let config;

try {
    config = require(path.normalize(__dirname + '/../..') + '/config.json');
} catch(error) {
    try {
        config = require('../config.json');
    } catch (error) {
        config = {};
    }
}

function get(key) {
    const keys = key.split('.');

    let result     = config;
    let useDefault = false;

    for (let i = 0; i < keys.length; i++) {
        result = result[keys[i]];

        if (result === undefined && !useDefault) {
            useDefault = true;
            result     = require('../build/default.json');

            i = -1;
        }
    }

    return result;
}
module.exports = {
    get: get
}