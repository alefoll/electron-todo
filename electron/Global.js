const argv = require('yargs').argv;

const Config = require('./Config');

const debug = argv.test || false;
const port  = Config.get('global.port');
const host  = `http://127.0.0.1:${port}`;

const storage = {};

function register(key, value) {
    storage[key] = value;
}

function retreive(key) {
    return storage[key];
}

module.exports = {
    debug : debug,
    port  : port,
    host  : host,

    register: register,
    retreive: retreive
}