"use strict";
requirejs(["require.config.js"], function(RequireConfig){
	var requireConfig = new RequireConfig().valueOf();
	requirejs.config(requireConfig);

	new Promise(function(resolve, reject){
		requirejs(["dollaclass", "postal"], function($Class, postal){
			window.$postal = window.postal = postal;
			window.$Class = $Class;
			window.$Inteface = $Class.$Interface;
			resolve();
		});
	}).then(function(){
		requirejs(["lodash", "Core", "tweener", "three", "threeOrbit"], function(_, Core, tweener, THREE, OrbitControls){
			THREE.OrbitControls = OrbitControls(THREE);
			window.THREE = THREE;
			window.core = new Core;
			window.core.load("funky", {
				name : "Sasha"
			});
		});
	});
});