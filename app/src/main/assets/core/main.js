"use strict";
requirejs(["require.config.js"], function(RequireConfig){
	var requireConfig = new RequireConfig().valueOf();
	requirejs.config(requireConfig);

	new Promise(function(resolve, reject){
		requirejs(["dollaclass"], function($Class){
			window.$Class = $Class;
			window.$Inteface = $Class.$Interface;
			resolve();
		});
	}).then(function(){
		requirejs(["lodash", "Core", "three"], function(_, Core, THREE){
			window.core = new Core;
			window.core.load("test.menu");
		});
	});
});