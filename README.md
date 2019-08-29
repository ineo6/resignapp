# RebuildApp

Rebuild and install app without jailbreak.

# Usage

```
$ npm install rebuildapp -g
$ mkdir tweak-demo && cd tweak-demo
$ rebuildapp --new
```

pack ipa

```
// auto search
// 1. find provisitionFile
// 2. find bundleId
$ rebuildapp

// pass file
$ rebuildapp  -i "iPhone Developer: xxx" -b "com.xx.test" -m ./embedded.mobileprovision -o result.ipa xxx.ipa
```

more command


```bash
  Usage: rebuildapp [--options ...] [ipafile]

  Options:

    -V, --version                             output the version number
    -n, --new                                 create a rebuild workspace.
    -b, --bundleid [BUNDLEID]                 Change the bundleid when repackaging
    -i, --identity [iPhone Distribution:xxx]  Specify Common name to use
    -k, --keychain [KEYCHAIN]                 Specify alternative keychain file
    -m, --mobileprovision [FILE]]             Specify the mobileprovision file to use
    -o, --output [APP.ipa]                    Path to the output IPA filename
    -ai, --auto                               auto install
    -h, --help                                output usage information
  Examples:

    $ resignapp -i "iPhone Distribution:xxx" -b "com.xx.test" test-app.ipa

```

# Templates

```
.
├── README.md
├── embedded.mobileprovision
├── lib                           # 待注入dylib
│   └── *.dylib
├── output
├── tool                          # 工具
│   ├── libsubstrate.dylib
│   └── yololib
└── workSpace                     # 工作区域
```
