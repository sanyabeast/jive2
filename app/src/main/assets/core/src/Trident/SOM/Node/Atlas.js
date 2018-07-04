"use strict";
define([
		"three",
		"Trident/SOM/Node/AtlasCore",
		"matter",
	], function(THREE, AtlasCore, matter){


	var Atlas = new $Class({ name : "Atlas", namespace : "Trident.SOM.Node", extends : [AtlasCore] }, {
		directives : {
			value : {
				"child" : function(value, type, node, parent, attributes){
					var childNode = node.selectFirst(value, true);
					return childNode ? childNode.subject : null;
				},
				"int" : function(value, type, node, parent, attributes){
					if (typeof attributes[value] == "undefined") return;
					var value = window.parseInt(attributes[value]) || 0;
					return value;
				},
				"float" : function(value, type, node, parent, attributes){
					if (typeof attributes[value] == "undefined") return;
					var value = window.parseFloat(attributes[value]) || 0;
					return value;
				},
				"parent" : function(value, type, node, parent, attributes){
					return parent;
				},
				"ancestor" : function(value, type, node, parent, attributes){
					var result = parent.root.querySelector(value);
					return result;
				},	
				"node" : function(value, type, node, parent, attributes){
					return node;
				},
				"global" : function(value, type, node, parent, attributes){
					var result;

					try {
						console.log(attributes[value]);
						result = eval(attributes[value]);
					} catch (err){
						console.warn("Failed to finish `global` directive");
					}

					return result;
				},
			}
		},
		descriptions : {
			value : {
				"position" : {
					source : "property",
					name : "position",
					members : {
						x : { type : "property", value : "x|value" },
						y : { type : "property", value : "y|value" },
						z : { type : "property", value : "z|value" },
					}
				},
				"rotation" : {
					source : "property",
					name : "rotation",
					members : {
						x : { type : "property", value : "x|value" },
						y : { type : "property", value : "y|value" },
						z : { type : "property", value : "z|value" },
					}
				},
				"scale" : {
					source : "property",
					name : "scale",
					members : {
						x : { type : "property", value : "x|value" },
						y : { type : "property", value : "y|value" },
						z : { type : "property", value : "z|value" },
					}
				},
				"axis-helper" : {
					source : "constructor",
					construct : THREE.AxesHelper,
					constructArgs : ["lines"],
					link : "parent.add(child)"
				},
				"renderer" : {
					source : "constructor",
					construct : {
						"webgl" : THREE.WebGLRenderer,
						"canvas" : THREE.CanvasRenderer
					},
					constructArgs : {
						"webgl" : ["{ antialias } "],
						"canvas" : []
					},
					members : {
						setSize : { type : "method", args : ["width", "height"] }
					}
				},
				"scene" : {
					source : "constructor",
					construct : THREE.Scene,
				},
				"camera" : {
					source : "constructor",
					construct : {
						"perspective" : THREE.PerspectiveCamera
					},
					constructArgs : {
						"perspective" : ["fov", "aspect", "near", "far"]
					},
					link : "parent.add(child)",
				},
				"light" : {
					source : "constructor",
					construct : {
						"point" : THREE.PointLight,
						"directional" : THREE.DirectionalLight,
						"ambient" : THREE.AmbientLight
					},
					constructArgs : {
						"point" : ["int::color", "float::intensity", "distance", "decay"],
						"directional" : ["int::color", "float::intensity"],
						"ambient" : ["int::color", "float::intensity"]
					},
					link : "parent.add(child)",
				},
				"group" : {
					source : "constructor",
					construct : THREE.Group,
					link : "parent.add(child)"
				},
				"mesh" : {
					childFirst : true,
					source : "constructor",
					construct : THREE.Mesh,
					constructArgs : ["child::geometry", "child::material"],
					link : "parent.add(child)",
				},
				"material" : {
					childFirst : true,
					source : "constructor",
					construct : {
						"lambert" : THREE.MeshLambertMaterial,
						"normal" : THREE.MeshNormalMaterial,
						"phong" : THREE.MeshPhongMaterial,
						"toon" : THREE.MeshToonMaterial,
						"shadow" : THREE.ShadowMaterial,
						"sprite" : THREE.SpriteMaterial
					},
					constructArgs : {
						"lambert" 	: ["{ int::color, float::opacity, transparent, int::side }"],
						"normal"  	: ["{ float::opacity, transparent, int::side }"],
						"phong"  	: ["{ int::color, float::opacity, transparent, int::side }"],
						"toon"  	: ["{ int::color, float::opacity, transparent, int::side }"],
						"shadow"  	: ["{ int::color, float::opacity, transparent, int::side }"],
						"sprite"  	: ["{ map=child::texture, int::color, float::opacity, transparent, int::side }"],
					}
				},
				"geometry" : {
					source : "constructor",
					construct : {
						"sphere" : THREE.SphereGeometry,
						"box" : THREE.BoxGeometry,
						"circle" : THREE.CircleGeometry,
						"cylinder" : THREE.CylinderGeometry,
						"cone" : THREE.ConeGeometry,
						"ring" : THREE.RingGeometry,
						"plane" : THREE.PlaneGeometry
					},
					constructArgs : {
						"sphere" : [
							"radius", 
							"widthSegments|segments", 
							"height-segments|segments", 
							"phi-start", 
							"phi-length", 
							"theta-start", 
							"theta-length"
						],
						"box" : [
							"width|size",
							"height|size",
							"depth|size",
							"widthSegments|segments",
							"height-segments|segments",
							"depthSegments|segments"
						],
						"circle" : ["radius", "segments", "theta-start", "theta-length"],
						"cylinder" : [
							"radiusTop|radius",
							"radiusBottom|radius",
							"height",
							"radial-segments|segments",
							"height-segments|segments",
							"openEnded",
							"theta-start",
							"theta-length"
						],
						"cone" : [
							"radius",
							"height",
							"radial-segments|segments",
							"height-segments|segments",
							"openEnded",
							"theta-start",
							"theta-length"
						],
						"ring" : [
							"inner-radius|radius", 
							"outer-radius|radius", 
							"thetaSegments|segments", 
							"phiSegments|segments", 
							"theta-start", 
							"theta-length"
						],
						"plane" : ["width", "height", "widthSegments|segments", "height-segments|segments"]
					}
				},
				"texture" : {
					source : "factory",
					construct : {
						"ready" : function(name){
							return window.resources.textures[name];
						},
						"load" : function(image){
							texture = new THREE.TextureLoader().load(image.src);
							return texture;
						}
					},
					constructArgs : {
						"ready" : ["name"],
						"load" : ["global::image", "mapping", "wrapS", "wrapT", "magFilter", "minFilter", "format", "type", "anisotrpy", "encoding"]
					}
				},
				"sprite" : {
					childFirst : true,
					source : "constructor",
					construct : THREE.Sprite,
					constructArgs : ["child::material"],
					link : "parent.add(child)"
				},
				/*MATTER*/
				"matter-engine" : {
					source : "factory",
					construct : function(){ 
						var engine = matter.Engine.create(); 
						setTimeout(function(){
							matter.Engine.run(engine);
						}, 2000)
						return engine;
					}
				},
				"matter-world" : {
					source : "factory",
					construct : function(engine){ 
						return engine.subject.world; 
					},
					constructArgs : ["ancestor::matter-engine"]
				},
				"matter-gravity" : {
					source : "property",
					name : "gravity",
					members : {
						x : { type : "property", value : "x|value" },
						y : { type : "property", value : "y|value" },
						z : { type : "property", value : "z|value" },
					}
				},
				"matter-position" : {
					source : "factory",
					construct : function(body, x, y){
						body = body.subject;

						matter.Body.setPosition(body, {
							x : x || body.position.x,
							y : y || body.position.y
						});

						return body.position;

					},
					constructArgs : ["parent::", "x", "y"]
				},
				"matter" : {
					childFirst : true,
					source : "factory",
					construct : function(parent, body, matterEngine){
						matter.World.add(matterEngine.subject.world, [body]);
						return unicycle.addTask(function(){
							parent.subject.position.x = body.position.x;
							parent.subject.position.y = body.position.y;
							parent.subject.rotation.z = body.angle;
						});	
						console.log(arguments);

					},
					constructArgs : ["parent::", "child::matter-body", "ancestor::matter-engine"]
				},
				"matter-body" : {
					source : "factory",
					construct : {
						"rectangle" : function(x, y, width, height, options){
							return matter.Bodies.rectangle(x, y, width, height, options);
						},
						"circle" : function(x, y, radius, options, maxSides){
							return matter.Bodies.circle(x, y, radius, options, maxSides)
						}
					},
					constructArgs : {
						"rectangle" : ["x", "y", "width", "height", "{ isStatic=static }"],
						"circle" : ["x", "y", "radius", "{  }", "maxSides"]
					}
				}
			}
		},
	});

	return Atlas;

});