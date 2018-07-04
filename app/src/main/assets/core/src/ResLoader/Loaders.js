"use strict";
define([
		"ResLoader/Loader",
		"howler",
		"three",
		"OBJLoader",
		"vue",
		"superagent"
	], function(Loader, Howler, THREE, OBJLoader, Vue, superagent){

	console.log(window);

	var Loaders = new $Class({ name : "Loaders", namespace : "Core.R" }, {
		$constructor : function(){},
		images : {
			value : new Loader(function(assetDescription, resolve, reject){
				new THREE.ImageLoader().load(assetDescription, function(image){
					resolve(image);
				});	
			})
		},
		textures : {
			value : new Loader(function(assetDescription, resolve, reject){
				new THREE.TextureLoader().load(assetDescription, function(texture){
					resolve(texture);
				});	
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
		object3D : {
			value : new Loader(function(assetDescription, resolve, reject){
				var manager = new THREE.LoadingManager();
				var $loader = new THREE.OBJLoader(manager);

				$loader.load(assetDescription, function(object3D){
					resolve(object3D);
				});
			})
		},
		templates : {
			value : new Loader(function(assetDescription, resolve, reject){
				var div = document.createElement("div");

				superagent.get(assetDescription).then(function(response){
					var xml = response.text;
					div.innerHTML = xml;

					resolve({
						dom : div.children[0],
						xml : div.innerHTML
					});

				}).catch(function(err){
					console.log(err);
					reject(err);
				})
				console.log(assetDescription);
			}, {
				cropExtension : true
			})
		},
		"vue-components" : {
			value : new Loader(function(assetDescription, resolve, reject){
				var div = document.createElement("div");

				superagent.get(assetDescription).then(function(response){
					var componentParams = {};
					var scriptParams = {};
					var xml = response.text;
					div.innerHTML = xml;

					var template = div.querySelector("template");
					var script = div.querySelector("script");

					var id = template.id;
					var props = template.getAttribute("props");
					props = props ? props.split(" ") : [];

					componentParams.template = template.innerHTML;

					if (script){
						script = script.cloneNode(true);
						try { scriptParams = eval(["var p = {", script.innerHTML, "};p;"].join("")); } catch (err){
							console.error(err);
						}
					}

					componentParams.props = props;
					componentParams.methods = scriptParams.methods;
					componentParams.data = scriptParams.data;

					resolve(Vue.component(id, componentParams));

				}).catch(function(err){
					console.log(err);
					reject(err);
				});
			})
		}
	});

	return Loaders;

});