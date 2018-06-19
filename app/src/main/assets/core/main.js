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
		requirejs(["lodash", "Core", "three", "threeOrbit"], function(_, Core, THREE, OrbitControls){
			THREE.OrbitControls = OrbitControls(THREE);
			window.THREE = THREE;
			window.core = new Core;
			window.core.load("trident");

			core.modules.list.r.loaders.sound.load([
				"apps/trident/res/sound/test.mp3"
			]).then(function(sounds){
				window.sounds = sounds;
			});

		});
	});
});