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
		object3D : {
			value : new Loader(function(assetDescription, resolve, reject){
				var manager = new THREE.LoadingManager();
				var $loader = new THREE.OBJLoader(manager);

				$loader.load(assetDescription, function(object3D){
					resolve(object3D);
				});
			})
		},
		template : {
			value : new Loader(function(assetDescription, resolve, reject){
				
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