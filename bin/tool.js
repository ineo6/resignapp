#!/usr/bin/env node

'use strict';

const path = require('path');
const fsExtra = require('fs-extra');
const fs = require('fs');
const childproc = require('child_process');
const spawn = require('child_process').spawn
const EventEmitter = require('events').EventEmitter;

function execProgram(bin, arg, opt, cb) {
  if (!opt) {
    opt = {};
  }
  opt.maxBuffer = 1024 * 1024;
  // return childproc.execFile(bin, arg, opt, cb);
  const child = spawn(bin, arg, opt);
  child.stdout.on('data', (data) => {
    cb(undefined, `${data}`);
  });

  child.stderr.on('data', (data) => {
    cb(undefined, undefined, `${data}`);
  });

  child.on('close', (code) => {
    cb(undefined, undefined, undefined, `${code}` + "")
  });
}

function isDirectory(directory) {
  try {
    return fsExtra.statSync(directory).isDirectory();
  } catch (e) {
    return false;
  }
}

function fileExist(file) {
  try {
    return fs.existsSync(file);
  } catch (e) {
    return false;
  }
}

function ensureDirExist(dir) {
  fsExtra.ensureDirSync(dir);
}

module.exports = class SignApp {
  constructor(state, onEnd) {
    this.config = JSON.parse(JSON.stringify(state));
    this.events = new EventEmitter();
    this.events.config = this.config;
  }

  /* Event Wrapper API with cb support */
  emit(ev, msg, cb) {
    this.events.emit(ev, msg);
    if (typeof cb === 'function') {
      return cb(msg);
    }
  }

  on(ev, cb) {
    this.events.on(ev, cb);
    return this;
  }

  resign(cb) {
    if (typeof cb === 'function') {
      this.events.removeAllListeners('end');
      this.events.on('end', cb);
    }

    const configs = this.prepare();
    this.executeResign(configs, (error, stdout, stderr, code) => {
      if (error) {
        // console.log("1" + error );
        this.emit('error', error, cb);
      } else if (stdout) {
        // console.log("2" + stdout );
        this.emit('message', stdout);
      } else if (stderr) {
        // console.log("3" + stderr );
        this.emit('warning', stderr);
      }
      if (code) {
        this.emit('end');
      }
    });
    return this;
  }

  prepare() {
    let currentWorkingDirectory = path.resolve(process.cwd());

    let keychain = this.config["keychain"] || "login.keychain";
    let ipa = this.config["file"];
    let identity = this.config["identity"];
    let output = this.config["output"] || "";
    let mobileprovision = this.config["mobileprovision"];
    let bundleId = this.config["bundleid"] || "null.null";
    let auto = this.config["auto"] || false;

    let ipaFile = ipa
    if (!isDirectory(ipaFile) && !fileExist(ipaFile)) {
      ipaFile = path.join(currentWorkingDirectory, ipaFile);
    }

    let resignedFileName = path.basename(ipaFile, path.extname(ipaFile)) + "-resigned" + path.extname(ipaFile);
    if (output.length == 0 || output === ipaFile) {
      output = path.join(currentWorkingDirectory, resignedFileName);
    } else if (!output.startsWith("/")) {
      //  relative path
      output = path.join(currentWorkingDirectory, output);
    }

    if (!output.toLowerCase().endsWith(".ipa")) {
      output = path.join(output, resignedFileName);
    }

    ensureDirExist(path.dirname(output));

    if (!isDirectory(mobileprovision) && !fileExist(mobileprovision)) {
      mobileprovision = path.join(currentWorkingDirectory, mobileprovision);
    }
    // console.log("keychain:" + keychain + "\n" + "ipa:" + ipaFile + "\n" + "identity:" + identity + "\n" +"output:" + output + "\n" + "mobileprovision:" + mobileprovision + "\n" + "bundleid:" + bundleId + "\n");

    const signFile = path.join(__dirname, 'resign.sh');
    return {
      keychain: keychain,
      ipa: ipa,
      identity: identity,
      output: output,
      mobileprovision: mobileprovision,
      bundleid: bundleId,
      auto: auto,
      signFile: signFile
    }
  }

  executeResign(configs, cb) {
    const keychain = configs.keychain;
    const signFile = configs.signFile;
    const ipaFile = configs.ipa;
    const identity = configs.identity;
    const mobileprovision = configs.mobileprovision;
    const output = configs.output;
    const bundleId = configs.bundleid;
    const auto = configs.auto;

    const args = [signFile, ipaFile, identity, mobileprovision, output, keychain, auto];

    if (bundleId.length > 0) {
      args.push(bundleId);
    }
    execProgram('/bin/bash', args, null, cb);
  }
};