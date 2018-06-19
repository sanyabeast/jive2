"use strict";
define([
		"R/Loader",
		"howler",
		"three",
		"OBJLoader"
	], function(Loader, Howler, THREE, OBJLoader){

	var Loaders = new $Class({ name : "Loaders", namespace : "Core.R" }, {
		$constructor : function(){},
		image : {
			value : new Loader(function(assetDescription, resolve, reject){
				var imageElement = document.createElement("img");

				imageElement.onload = function(){
					resolve(imageElement);
				};

				imageElement.onerror = function(evt){
					resolve(null);
					reject(evt);
				};

				imageElement.src = assetDescription;
			})
		},
		sound : {
			value : new Loader(function(assetDescription, resolve, reject){
				var sound = new Howler.Howl({
					src : [ assetDescription ],
					onload : function(){
						resolve(sound);
					},
					onloaderror : function(err){
						resolve(null);
						reject(err)
					}
				});
			})
		},
		obj : {
			value : new Loader(function(assetDescription, resolve, reject){
				var manager = new THREE.LoadingManager();
				var $loader = new THREE.OBJLoader(manager);

				$loader.load(assetDescription, function(object3D){
					resolve(object3D);
				});
			})
		}
	});

	return Loaders;

});