# RebuildApp

Rebuild and install app without jailbreak.

# Usage

```sh
$ npm install rebuildapp -g

# create template in your workspace
$ rebuildapp --new

$ cd $workspace

# pack ipa
# auto find provisitionFile、bundleId、ipa
$ rebuildapp

```

more command


```sh
  Usage: rebuildapp [--options] [ipafile]

  Options:

    -V, --version                             output the version number
    -n, --new                                 create a rebuild workspace.
    -b, --bundleid [BUNDLEID]                 Change the bundleid when repackaging
    -i, --identity [iPhone Distribution:xxx]  Specify Common name to use
    -k, --keychain [KEYCHAIN]                 Specify alternative keychain file
    -m, --mobileprovision [FILE]]             Specify the mobileprovision file to use
    -o, --output [APP.ipa]                    Path to the output IPA filename
    -a, --auto                                auto install
    -h, --help                                output usage information
  Examples:

    $ rebuildapp --auto wechat.ipa

```

# Template

```sh
.
├── README.md
├── embedded.mobileprovision         
├── lib
│   └── WeChatRedEnvelop.dylib       # dylib
└── tool                             # dylib tool
    ├── libsubstrate.dylib
    └── yololib
```
