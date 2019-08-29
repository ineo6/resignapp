#!/usr/bin/env node

'use strict';

const packageJson = require('../package.json');
const program = require('commander');
const chalk = require('chalk');
const SignApp = require('./tool.js');
const newCli = require('./new.js');

let ipa = "";

program.version(packageJson.version)
    .usage('[--options ...] [ipafile]')
    .option('-n, --new', 'create a rebuild workspace.')
    .option('-b, --bundleid [BUNDLEID]', 'Change the bundleid when repackaging')
    .option('-i, --identity [iPhone Distribution:xxx]', 'Specify Common name to use')
    .option('-k, --keychain [KEYCHAIN]', 'Specify alternative keychain file')
    .option('-m, --mobileprovision [FILE]]', 'Specify the mobileprovision file to use')
    .option('-o, --output [APP.ipa]', 'Path to the output IPA filename')
    .option('-ai, --auto', 'auto install')
    .option('-d, --debug','debug mode')
    //.option('[ipafile]', 'Path to the IPA file to resign').arguments('<cmd> [env]')
    .arguments('<ipafile>')
    .action(function (ipafile) {
        ipa = ipafile;
    });

program.parse(process.argv);

program.on('--help', function () {
    console.log('  Examples:');
    console.log('');
    console.log('    $ resignapp -i "iPhone Distribution:xxx" -b "com.xx.test" test-app.ipa');
    console.log('');
});

// if (!process.argv.slice(2).length) {
//     program.outputHelp();
//     return false;
// }

if (program.new || program.n) {
    newCli(process.argv);
    return false;
}

const options = {
    file: ipa || '',
    output: program.output,
    bundleid: program.bundleid || "",
    identity: program.identity || "",
    mobileprovision: program.mobileprovision || "",
    keychain: program.keychain || "",
    auto: program.auto,
    debug: program.debug,
};

const ca = new SignApp(options);

if (!options.identity || !options.mobileprovision) {
    console.log(chalk.yellow("Will auto serach mobileprovision and identity"));
}

console.log(chalk.green("Begin resign..."));
ca.resign((error, data) => {
    if (error) {
        console.error(error, data);
    }
    console.log(chalk.green("Finish resign..."));

}).on('message', (msg) => {
    console.log(chalk.green(msg));
}).on('warning', (msg) => {
    console.warn(chalk.yellow('warn'), msg);
}).on('error', (msg) => {
    console.error(chalk.red(msg));
});
