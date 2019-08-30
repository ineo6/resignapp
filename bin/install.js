#!/usr/bin/env node

'use strict';

const iosDevice = require('node-ios-device');
const program = require('commander');
const packageJson = require('../package.json');

program.version(packageJson.version)
    .option('-a, --app <path>', 'the path of app.')
    .option('--debug', 'enable debugger')
    .parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
    return false;
}

function install(path) {
    const handle = iosDevice
        .trackDevices()
        .on('devices', function (devices) {
            if (devices && devices.length > 0) {
                console.log('Connected devices:', devices[0].name);

                // install an iOS app
                iosDevice.installApp(devices[0].udid, path, function (err) {
                    if (err) {
                        console.error('Error!', err);
                    } else {
                        handle.stop();
                        console.log('Success!');
                    }
                });
            } else {
                console.log('Waiting device!');
            }
        })
        .on('error', function (err) {
            console.error('Error!', err);
        });
}

if (program.app) {
    install(program.app);
}
