"use strict";
requirejs(["require.config.js"], function(RequireConfig){
	requirejs.config(new RequireConfig().valueOf());

	new Promise(function(resolve, reject){
		requirejs(["dollaclass"], function($Class){
			window.$Class = $Class;
			window.$Inteface = $Class.$Interface;
			resolve();
		});
	}).then(function(){
		requirejs(["lodash", "Core"], function(_, Core){
			window.core = new Core;
			window.core.load("test.menu");
		});
	});
});