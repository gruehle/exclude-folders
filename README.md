exclude-folders
===============

Brackets extension for excluding folders from the file tree, find in files, and quick open.

To install:

1. Launch Brackets
2. Select _File > Extension Manager..._ or click the Lego icon in the toolbar
3. Click the "Install from URL..." button
4. Paste (or enter) `https://github.com/gruehle/exclude-folders` and click "Install"

By default, this extension excludes all `node_modules` folders. If you want to exclude additional folders, open the preferences file (menu `debug -> open preferences file`), locate the entry called "exclude-folders" and enter any valid regExp. For example, if you want to exclude all items that contain the words `node_modules`, `bin`, and `componenets`, use:

```json
    {
        "exclude-folders.regExp": "node_modules|bin|components"
    }
```

Note that this will match these words *anywhere* in the folder *or* file name. For example, if you have a folder named "my-components", it will also be excluded. You can use the `^` and `$` anchors to ensure that the name must be a complete match:


```json
     {
        "exclude-folders.regExp": "^(node_modules|bin|components)$"
    }
```

Matching is case sensitive by default. Add `i` to the `exclude-folders.flags` node:


```json
     "exclude-folders.regExp": "^(node_modules|bin|components)$",
     "exclude-folders.flags":  "i"
```



