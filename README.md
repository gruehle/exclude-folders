exclude-folders
===============

Brackets extension for excluding folders from the file tree, find in files, and quick open.

Install
---------------

1. Launch Brackets
2. Select _File > Extension Manager..._ or click the Lego icon in the toolbar
3. Click the "Install from URL..." button
4. Paste (or enter) `https://github.com/gruehle/exclude-folders` and click "Install"

Configure
---------------

In order to get this extension work, you must define exclusions in configuration file,
brackets global config or project config.

To define those exclusions globally:

_Debug > Open preferences file_

… and then add config.

or on a per project basis:

Create `.brackets.json` in project root

*Note:*

*Project config completely redefine exclusion rules from global config.*

Configuration sample

```
{
	"gruehle.exclude-folders.patterns": [
		"platforms",
		"plugins/*.json"
	]
}
```

Incompatibilities with previous version
------------------------

Extension code is rewritten, so you need to migrate your changes on your own.

In current version there is no way to declare case insensitive rules.
