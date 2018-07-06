"use strict";
define([
		"three"
	], function(THREE){

	var PolyShader = new $Class({ name : "PolyShader", namespace : "Plot3.Helpers" }, {
		$constructor : function(type, shader){
			this.type = type;
			this.polyshaderTree = shader;
			this.shaderCode = this.$generatePolyShaderCode(this.polyshaderTree);
			this.uniforms = this.$createUniformsList(this.polyshaderTree);
		},
		shaderCode : {
			value : null,
			writable : true,
			configurable : true
		},
		$typeDefaults : {
			value : {
				"float" 	: 0.0,
				"int" 		: 0,
				"vec2" 		: new THREE.Vector2(0,0), 
				"vec3" 		: new THREE.Vector3(0,0,0), 
				"vec4" 		: new THREE.Vector4(0,0,0,0), 
				"mat3"		: new THREE.Matrix3(),
				"mat4"		: new THREE.Matrix4(),
			}
		},
		$generatePolyShaderCode : function(polyshaderTree){
			var shaderCode = "";
			var callSequence = [];

			this.$select(polyshaderTree, "uniforms", function(uniformsNode){
				this.$select(uniformsNode, "item", function(item){
					shaderCode = [shaderCode, ["uniform", item.getAttribute("type"), item.getAttribute("name")].join(" ") + ";"].join("\n")
				}, this);
			}, this);

			this.$select(polyshaderTree, "attributes", function(attributesNode){
				this.$select(attributesNode, "item", function(item){
					shaderCode = [shaderCode, ["attribute", item.getAttribute("type"), item.getAttribute("name")].join(" ") + ";"].join("\n")
				}, this);
			}, this);

			this.$select(polyshaderTree, "varyings", function(attributesNode){
				this.$select(attributesNode, "item", function(item){
					shaderCode = [shaderCode, ["varying", item.getAttribute("type"), item.getAttribute("name")].join(" ") + ";"].join("\n")
				}, this);
			}, this);

			this.$select(polyshaderTree, "program", function(program){
				shaderCode = [shaderCode, program.textContent].join("\n");
			}, this);

			return shaderCode;
		},
		$select : function(source, selector, iteratee){
			var elements = source.querySelectorAll(selector);
			for (var a = 0, l = elements.length; a < l; a++){
				iteratee.call(this, elements[a], a, elements);
			}

			return elements;
		},
		$contains : function(source, selector, attributes){
			var attributeString = "";
			var mSelector;

			for (var k in attributes){
				attributeString += ["[", k, "=", "\"", attributes[k], "\"", "]"].join("");
			}

			mSelector = [selector, attributeString].join("");
			return source.querySelectorAll(mSelector).length > 0;
		},
		$createUniformsList : function(polyshaderTree){
			var uniforms = {};

			this.$select(polyshaderTree, "uniforms", function(uniformsNode){
				this.$select(uniformsNode, "item", function(item){
					var name = item.getAttribute("name");
					var type = item.getAttribute("type");

					uniforms[name] = type;
				})
			});

			return uniforms;

		},
		$getDefaultValueFor : function(type, name){
			//console.warn("PolyShader falling back to generating default value for `" + type + "` with name `" + name + "` this is unsafe");
			return this.$typeDefaults[type];
		},
		$normalizeValue : function(type, value){
			var _value = value;

			if (type == "vec3" && (typeof value == "number"  || typeof value == "string")){
				_value = new THREE.Color();
				_value.setHex(value);
			}

			if (type == "vec2" && Array.isArray(value)){
				_value = new THREE.Vector2();
				_value.fromArray(value);
			}

			if (type == "vec3" && Array.isArray(value)){
				_value = new THREE.Vector3();
				_value.fromArray(value);
			}

			if (type == "vec4" && Array.isArray(value)){
				_value = new THREE.Vector4();
				_value.fromArray(value);
			}

			return _value;
		},
		collectUniforms : function(uniformsContainer, custom, useDefault){
			var common = this.common;
			var _this = this;

			_.forEach(this.uniforms, function(type, name){
				if (custom && custom[name]){
					uniformsContainer[name] = {
						value : this.$normalizeValue(type, custom[name])
					};
				} else if (common[name]){
					uniformsContainer[name] = {
						get value(){
							return common[name];
						}
					};
				} else {
					if (useDefault){
						uniformsContainer[name] = {
							value : this.$getDefaultValueFor(type, name)
						};
					}
				}
			});

			return uniformsContainer;
		},
		common : {
			static : true,
			value : {
				time : 1,
				resolution : new THREE.Vector2(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio),
				mouse : new THREE.Vector2(0, 0)
			}
		}
	});

	window.addEventListener("resize", function(){
		PolyShader.common.resolution.x = window.innerWidth * window.devicePixelRatio;
		PolyShader.common.resolution.y = window.innerHeight * window.devicePixelRatio;
	});


	return PolyShader;

});