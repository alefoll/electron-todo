const builder = require("electron-builder");

const { Platform } = builder;

module.exports = (done) => {
    'use strict';

    builder.build({
        targets: Platform.WINDOWS.createTarget(),
        config: {
            appId: "com.electron.fdgueux.todos",
            directories: {
                buildResources: "buildResources"
            },
            extraResources: [
                "config.json"
            ],
            files: [
                "**/*",
                "!.editorconfig",
                "!.eslintrc.json",
                "!.gitignore",
                "!GulpFile.js",
                "!README.md",
                "!config.json",
                "!src",
                "!tasks",
                "!yarn.lock"
            ],
            win: {
                target: "nsis",
                icon: "build/assets/logo.ico"
            }
        }
    }).then(() => {
        done();
    }).catch((error) => {
        console.error(error);
        done();
    })
};