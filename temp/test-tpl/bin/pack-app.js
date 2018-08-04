#!/usr/bin/env node
'use strict';

const packageJson = require('../package.json');
const program = require('commander');
const chalk = require('chalk');
const SignApp = require('./tool.js');
const newCli = require('./new.js');
const conf = require('minimist')(process.argv.slice(2), {
  boolean: [
  ]
});

const options = {
  file: conf._[0] || 'undefined',
  output: conf.output || conf.o,
  bundleid: conf.bundleid || conf.b,
  identity: conf.identity || conf.i,
  mobileprovision: conf.mobileprovision || conf.m,
  keychain: conf.keychain || conf.k
};

program.version(packageJson.version)
  .usage('[--options ...] [input-ipafile]')
  .option('-n, --new', 'new a Ant Design Pro project.')
  .option('-b, --bundleid [BUNDLEID]', 'Change the bundleid when repackaging')
  .option('-i, --identity [iPhone Distribution:xxx]', 'Specify Common name to use')
  .option('-k, --keychain [KEYCHAIN]', 'Specify alternative keychain file')
  .option('-m, --mobileprovision [FILE]]', 'Specify the mobileprovision file to use')
  .option('-o, --output [APP.ipa]', 'Path to the output IPA filename')
  .option('[input-ipafile]', 'Path to the IPA file to resign')
  .parse(process.argv);

 
program.on('--help', function(){
    console.log('  Examples:');
    console.log('');
    console.log('    $ resignapp -i "iPhone Distribution:xxx" -b "com.xx.test" -k ~/Library/Keychains/login.keychain test-app.ipa');
    console.log('');
});

if (!process.argv.slice(2).length) {
    program.outputHelp();
    return false;
}

if (program.new || program.n) {
    newCli(process.argv);
    return false;
}

const ca = new SignApp(options);

if (!options.identity || !options.mobileprovision) {
  console.error(chalk.red("Must provid mobileprovision and identity"));
} else {
  console.log(chalk.green("Begin resign..."));
  ca.resign( (error, data) => {
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
}