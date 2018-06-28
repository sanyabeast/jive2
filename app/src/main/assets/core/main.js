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
		requirejs(["lodash", "Core", "tweener", "three", "threeOrbit"], function(_, Core, tweener, THREE, OrbitControls){
			THREE.OrbitControls = OrbitControls(THREE);
			window.THREE = THREE;
			window.core = new Core;
			window.core.load("trident", {
				name : "Sasha"
			});

			core.modules.r.loaders.obj.load([
				"apps/trident/res/object3D/male02.obj"
			]).then(function(objs){
				window.objs = objs;
				addMan(objs);
			});

			function addMan(objs){
				if (window.core.modules.frameDriver.activities.trident.window.scene){
					objs[0].position.z = -500;

					var basicMaterial = new THREE.MeshPhongMaterial({
						color: 0x841138
					})

					objs[0].traverse(function(child){
						child.material = basicMaterial;
					});

					tweener.to(objs[0].rotation, 5, {
						y : 2 * Math.PI,
						repeat : -1,
						yoyo : true,
						ease : "easeInOutQuad"
					});

					tweener.to(objs[0].scale, 2.5, {
						x : 0.7,
						y : 0.7,
						z : 0.7,
						repeat : -1,
						yoyo : true,
						ease : "easeInOutQuad"
					});

					window.core.modules.frameDriver.activities.trident.window.scene.add(objs[0]);
					window.objs = objs;

				} else {
					setTimeout(addMan.bind(null, objs), 1000);
				}
			}

			core.modules.r.loaders.sound.load([
				"apps/trident/res/sound/test.mp3"
			]).then(function(sounds){
				console.log(sounds);
				window.sounds = sounds;
			});


		});
	});
});