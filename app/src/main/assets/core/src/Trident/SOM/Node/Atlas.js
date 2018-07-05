"use strict";
define([
		"three",
		"Trident/SOM/Node/AtlasCore",
		"Trident/Tools/PolyShader",
		"matter",
	], function(THREE, AtlasCore, PolyShader, matter){


	var Atlas = new $Class({ name : "Atlas", namespace : "Trident.SOM.Node", extends : [AtlasCore] }, {
		AtlasCore : {
			static : true,
			value : AtlasCore
		},
		directives : {
			static : true,
			value : {
				"child" : function(value, type, node, parent, attributes){
					var childNode = node.selectFirst(attributes[value], true);
					return childNode ? childNode.subject : null;
				},
				"sibl" : function(value, type, node, parent, attributes){
					return parent.selectFirst(attributes[value]);
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
				"select" : function(value, type, node, parent, attributes){
					var result = parent.root.querySelector(attributes[value]);
					return result;
				},	
				"node" : function(value, type, node, parent, attributes){
					return node;
				},
				"eval" : function(value, type, node, parent, attributes){
					var result;

					try {
						result = eval(attributes[value]);
					} catch (err){
						console.warn("Failed to finish `global` directive");
					}

					return result;
				},
				select_dom : function(value, type, node, parent, attributes){
					var selector = attributes[value];
					var element = document.querySelector(selector);
					return element;
				},
				"node" : function(value, type, node){
					return node;
				},
				"attributes" : function(value, type, node, parent, attributes){
					return attributes;
				}
			}
		},
		descriptions : {
			static : true,
			value : {
				/*common*/
				"object" : {
					source : "factory",
					construct : function(attributes){
						return attributes;
					},
					constructArgs : ["attributes::"]

				},
				/*shadowing*/
				"light-shadow" : {
					source : "property",
					name : "shadow",
				},
				"light-shadow-map" : {
					source : "property",
					name : "mapSize",
					members : {
						width 	: { type : "property", value : "width|size" },
						height 	: { type : "property", value : "height|size" },
					}
				},
				"light-shadow-camera" : {
					source : "property",
					name : "camera",
					members : {
						near 	: { type : "property", value : "near" },
						far 	: { type : "property", value : "far" },
					}
				},
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
				"renderer-shadowmap" : {
					source : "property",
					name : "shadowMap",
					members : {
						enabled : { type : "property", value : "enabled" },
						type 	: { type : "property", value : "eval::type" },
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
						"ambient" : THREE.AmbientLight,
						"spot" : THREE.SpotLight
					},
					constructArgs : {
						"point" : ["int::color", "float::intensity", "distance", "decay"],
						"directional" : ["int::color", "float::intensity"],
						"ambient" : ["int::color", "float::intensity"],
						"spot" : ["int::color", "float::intensity"],
					},
					members : {
						"castShadow" : { type : "property", value : "cast-shadow" },
						"shadowCameraVisible" : { type : "property", value : "shadowcamera-visible" }
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
					members : {
						"castShadow" 	: { type : "property", value : "cast-shadow" },
						"receiveShadow" : { type : "property", value : "receive-shadow" },
					}
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
						"sprite" : THREE.SpriteMaterial,
					},
					constructArgs : {
						"lambert" 	: ["{ int::color, float::opacity, transparent, eval::side }"],
						"normal"  	: ["{ float::opacity, transparent, eval::side }"],
						"phong"  	: ["{ int::color, float::opacity, transparent, eval::side }"],
						"toon"  	: ["{ int::color, float::opacity, transparent, eval::side }"],
						"shadow"  	: ["{ int::color, float::opacity, transparent, eval::side }"],
						"sprite"  	: ["{ map=child::texture, int::color, float::opacity, transparent, eval::side }"],
					}
				},
				"shader-material" : {
					childFirst : true,
					source : "factory",
					construct : function(options){

						options.fragmentShader = options.fragmentShader.shaderCode;
						options.vertexShader = options.vertexShader.shaderCode;
						options.uniforms = options.uniforms;

						return new THREE.ShaderMaterial(options);
					},
					constructArgs : [" { uniforms=child::uniforms, vertexShader=child::vertex, fragmentShader=child::fragment, transparent } "]
				},
				"shader-uniforms" : {
					childFirst : true,
					source : "factory",
					construct : function(vertex, fragment, custom){
						var uniforms = {};

						vertex = vertex.subject;
						fragment = fragment.subject;

						uniforms = fragment.collectUniforms(uniforms, custom, true);
						uniforms = vertex.collectUniforms(uniforms, custom, true);


						return uniforms;
					},
					constructArgs : ["sibl::vertex", "sibl::fragment", "child::custom"]
				},
				"polyshader" : {
					source : "constructor",
					construct : function(type, shader){
						var polyshader = new PolyShader(type, shader);
						return polyshader;
					},
					constructArgs : ["type", "eval::shaderxml"]
				},
				"geometry" : {
					source : "constructor",
					construct : {
						"sphere" : THREE.SphereBufferGeometry,
						"box" : THREE.BoxBufferGeometry,
						"circle" : THREE.CircleBufferGeometry,
						"cylinder" : THREE.CylinderBufferGeometry,
						"cone" : THREE.ConeBufferGeometry,
						"ring" : THREE.RingBufferGeometry,
						"plane" : THREE.PlaneBufferGeometry,
						"torus" : THREE.TorusGeometry
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
							"theta-segments|segments", 
							"phi-segments|segments", 
							"theta-start", 
							"theta-length"
						],
						"plane" : ["width", "height", "widthSegments|segments", "height-segments|segments"],
						"torus" : ["radius", "tube", "radial-segments|segments", "tubular-segments|segments", "arc"]
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
						"load" : ["eval::image", "mapping", "wrapS", "wrapT", "magFilter", "minFilter", "format", "type", "anisotrpy", "encoding"]
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
					constructArgs : ["select::engine"]
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

					},
					constructArgs : ["parent::", "child::body", "select::engine"]
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
				},
				"matter-mouse" : {
					source : "factory",
					construct : function(element){
						return matter.Mouse.create(element);
					},
					constructArgs : ["select_dom::element"]
				},
				"matter-mouse-constraint" : {
					source : "factory",
					construct : function(engine, options){
						options.mouse = options.mouse.subject;

						console.log(engine, options);

						return matter.MouseConstraint.create(engine.subject, options);
					},
					constructArgs : ["select::engine", "{ mouse=select::mouse, constraint={} }"]
				}
			}
		},
	});

	return Atlas;

});