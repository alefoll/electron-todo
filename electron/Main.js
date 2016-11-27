const electron = require('electron');

const { BrowserWindow } = require('electron');

const Config = require('./Config');
const Global = require('./Global');

module.exports = () => {
    let screen;
    let devToolsSize = 0;

    if (Global.debug) {
        screen       = electron.screen.getAllDisplays()[1].workArea;
        devToolsSize = 700;
    } else {
        screen = electron.screen.getPrimaryDisplay().workAreaSize;
    }

    const { x = 0, y = 0, width, height } = screen;

    let bounds = {
        x      : x + width,
        y      : y + height,
        width  : (Config.get('main.width') + devToolsSize > width) ? width  : Config.get('main.width') + devToolsSize,
        height : (Config.get('main.height') > height)              ? height : Config.get('main.height')
    }

    bounds.x -= bounds.width;
    bounds.y -= bounds.height;

    const window = new BrowserWindow({
        x               : bounds.x,
        y               : bounds.y,
        width           : bounds.width,
        height          : bounds.height,
        movable         : Config.get('main.movable'),
        resizable       : Config.get('main.resizable'),
        fullscreenable  : Config.get('main.fullscreenable'),
        autoHideMenuBar : Config.get('main.autoHideMenuBar'),
        alwaysOnTop     : Config.get('main.alwaysOnTop'),
        show            : Config.get('main.show'),
        frame           : Config.get('main.frame'),
        webPreferences  : {
            webSecurity : false
        }
    });

    window.setMenu(null);

    window.once('ready-to-show', () => {
        window.show();

        if (Global.debug)
            window.webContents.openDevTools();
    });

    window.on('close', (event) => {
        event.preventDefault();

        window.hide();
    });

    return {
        window : window,
        bounds : bounds
    }
}