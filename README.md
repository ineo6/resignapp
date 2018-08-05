# RebuildApp

Rebuild and install app without jailbreak.

# Usage

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