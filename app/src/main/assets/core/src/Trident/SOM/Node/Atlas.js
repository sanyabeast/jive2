"use strict";
define([
		"three",
		"Trident/SOM/Node/AtlasCore"
	], function(THREE, AtlasCore){

	var Atlas = new $Class({ name : "Atlas", namespace : "Trident.SOM.Node", extends : [AtlasCore] }, {
		directives : {
			value : {
				"child" : function(value, type, node, parent, attributes){
					var childNode = node.querySelector(value, true);
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
					construct : THREE.WebGLRenderer,
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
						"directional" : THREE.DirectionalLight
					},
					constructArgs : {
						"point" : ["int::color", "float::intensity", "distance", "decay"],
						"directional" : ["int::color", "float::intensity"]
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
						"lambert" : ["{ int::color, float::opacity, transparent }"],
						"normal"  : ["{ int::color, float::opacity, transparent }"],
						"phong"  : ["{ int::color, float::opacity, transparent }"],
						"toon"  : ["{ int::color, float::opacity, transparent }"],
						"shadow"  : ["{ int::color, float::opacity, transparent }"],
						"sprite"  : ["{ map=child::texture, int::color, float::opacity, transparent }"],
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
						"ring" : THREE.RingGeometry
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
						]
					}
				},
				"texture" : {
					source : "factory",
					get construct(){
						var loader = new THREE.TextureLoader();
						return loader.load.bind(loader);
					},
					constructArgs : ["src"]
				},
				"sprite" : {
					childFirst : true,
					source : "constructor",
					construct : THREE.Sprite,
					constructArgs : ["child::material"],
					link : "parent.add(child)"
				}
			}
		},
	});

	return Atlas;

});