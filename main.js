/*
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true,  regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets */

define(function (require, exports, module) {
    "use strict";
    
	var moduleId = 'gruehle.exclude-folders';
	
    var FileSystem         = brackets.getModule("filesystem/FileSystem");
	var ProjectManager     = brackets.getModule("project/ProjectManager");
	var PreferencesManager = brackets.getModule("preferences/PreferencesManager");
	
	var prefs = PreferencesManager.getExtensionPrefs(moduleId);
    
	// First, we define our preference so that Brackets knows about it.
	// Eventually there may be some automatic UI for this.
	// Name of preference, type and the default value are the main things to define.
	// This is actually going to create a preference called "myextensionname.enabled".
	prefs.definePreference("format", "string", "glob"); // or regexp
	
	// Set up a listener that is called whenever the preference changes
	// You don't need to listen for changes if you can just look up the current value of
	// the pref when you're performing some operation.
	prefs.definePreference("patterns", "array", []).on("change", function () {
		// This gets the current value of "enabled" where current means for the
		// file being edited right now.
		// TODO: reset project cache to really refresh file tree
		ProjectManager.getProjectRoot()._clearCachedData();
		ProjectManager.refreshFileTree();
	});
	
    var _oldFilter = FileSystem._FileSystem.prototype._indexFilter;
    
    FileSystem._FileSystem.prototype._indexFilter = function (path, name) {
        // Call old filter
        var result = _oldFilter.apply(this, arguments);
		
        if (!result) {
            return false;
        }
		
		var prefs = PreferencesManager.getExtensionPrefs(moduleId);
		var projectRoot = ProjectManager.getProjectRoot().fullPath;
		
		var exclPatterns = prefs.get ('patterns');
		var exclFormat   = prefs.get ('format') || "glob";
		var fileNameInProject = ("" + path).indexOf (projectRoot) === 0 ? path.substr (projectRoot.length) : "";
		
		// console.log (patterns, projectRoot, fileNameInProject);
				
		if (!exclPatterns || !fileNameInProject || fileNameInProject.length == 0)
			return true;
		
		for (var i = 0; i < exclPatterns.length; i++) {
			var exclPattern = exclPatterns[i];
			if (exclFormat === "glob") {
				// TODO: use
				// https://github.com/isaacs/minimatch/
				exclPattern = exclPattern
					.replace (/^\//g, '^')
					.replace (/\//g, '\\/')
					.replace (/\*\*/g, 'REPLACE_ME_WITH_DOT_ASTERISK_LATER')
					.replace (/\*/g, '[^\\/]+')
					.replace (/\./g, '\\.')
					.replace (/\?/g, '.')
					.replace (/REPLACE_ME_WITH_DOT_ASTERISK_LATER/g, ".*");
				// console.log (exclPattern);
			}
			
			if (fileNameInProject.match (exclPattern)) {
				return false;
			}
		}
		
		return true;
		// console.log (fileNameInProject, name);
        
        // return !name.match(/node_modules/);
    };
});
