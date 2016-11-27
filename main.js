const { app } = require('electron');

const express = require('express');

const Main    = require('./electron/Main');

const Config = require('./electron/Config');
const Global = require('./electron/Global');
const Tray   = require('./electron/Tray');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let webServer;

let main;

let tray;

const singleInstance = app.makeSingleInstance(() => {
	// Someone tried to run a second instance, we should focus our window.
    if (main.window && (!main.window.isVisible() || main.window.isMinimized() || !main.window.isFocused()))
        main.window.show();
})

if (singleInstance)
    app.quit();

app.on('ready', () => {
    if (!Global.debug) {
        webServer = express();

        webServer.use(express.static(__dirname + '/build'));

        webServer.listen(Config.get('global.port'));
    }

    main = Main();

    tray = Tray(main);

    Global.register('main', main);

    main.window.loadURL(`${Global.host}/index.html`);
});

app.on('will-quit', () => {
    main.window.removeAllListeners();
})