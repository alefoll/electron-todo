const { Tray, app, Menu } = require('electron');

const path = require('path');

const Config = require('./Config');

module.exports = (main) => {
    const tray = new Tray(path.resolve(`${__dirname}/../build/assets/tray.png`));

    tray.on('click', () => {
        if (!main.window.isVisible()) {
            main.showPopin();
            main.window.show();
        }
    });

    tray.on('double-click', () => {
        if (!main.window.isVisible()) {
            main.showPopin();
            main.window.show();
        }
    });

    const quit = () => {
        main.window.destroy();

        app.quit();

        setTimeout(() => {
            app.exit();
        }, 1000)
    }

    const contextMenu = Menu.buildFromTemplate([
		{ label: 'Reload',         click() { main.window.reload(); }},
		{ label: 'Open Dev Tools', click() { main.window.webContents.openDevTools(); }},
		{ label: 'Exit',           click() { quit(); }}
    ]);

    tray.setToolTip(Config.get('tray.name'));
    tray.setContextMenu(contextMenu);

    return tray;
}