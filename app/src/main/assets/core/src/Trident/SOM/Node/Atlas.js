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
						x : { type : "property" },
						y : { type : "property" },
						z : { type : "property" },
					}
				},
				"rotation" : {
					source : "property",
					name : "rotation",
					members : {
						x : { type : "property" },
						y : { type : "property" },
						z : { type : "property" },
					}
				},
				"scale" : {
					source : "property",
					name : "scale",
					members : {
						x : { type : "property" },
						y : { type : "property" },
						z : { type : "property" },
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
					source : "constructor",
					construct : {
						"lambert" : THREE.MeshLambertMaterial
					},
					constructArgs : {
						"lambert" : ["{ int::color }"]
					}
				},
				"geometry" : {
					source : "constructor",
					construct : {
						"sphere" : THREE.SphereGeometry,
						"box" : THREE.BoxGeometry
					},
					constructArgs : {
						"sphere" : [
							"radius", 
							"widthSegments|segments", 
							"heightSegments|segments", 
							"phiStart", 
							"phiLength", 
							"thetaStart", 
							"thetaLength"
						],
						"box" : [
							"width|size",
							"height|size",
							"depth|size",
							"widthSegments|segments",
							"heightSegments|segments",
							"depthSegments|segments"
						]
					}
				}
			}
		},
	});

	return Atlas;

});