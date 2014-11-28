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

    var EXTENSION_NAME = "exclude-folders",
		AppInit = brackets.getModule('utils/AppInit'),
		FileSystem  = brackets.getModule("filesystem/FileSystem"),
		prefs = brackets.getModule("preferences/PreferencesManager").getExtensionPrefs(EXTENSION_NAME);

	var ExcludeFolders = {
		init: function() {
			if (typeof prefs.get('regExp') === 'undefined') {
				this.createPreferences();
			}
			
			prefs.on('change', ExcludeFolders.getPreferences);

			this.getPreferences();
			this.installFilter();
		},
		createPreferences: function() {
			prefs.definePreference('regExp', 'string', 'node_modules');
			prefs.definePreference('flags', 'string', '');
			
			prefs.set('regExp', 'node_modules');
			prefs.set('flags', '');

			prefs.save();
		},
		getPreferences: function() {
			ExcludeFolders.regExp = new RegExp(prefs.get('regExp'), prefs.get('flags'));
		},
		installFilter: function() {
			var _oldFilter = FileSystem._FileSystem.prototype._indexFilter;

			FileSystem._FileSystem.prototype._indexFilter = function (path, name) {
				// Call old filter
				var result = _oldFilter.apply(this, arguments);
				
				if (!result) {
					return false;
				}
				
				return !name.match(this.regExp);
			};
		}
	};

	AppInit.appReady(function() {
		ExcludeFolders.init();
	});
});
