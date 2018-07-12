"use strict";
define(function(){

	var ToolChain = new $Class({ name : "ToolChain", namespace : "Core" }, {
		template : function(id, nodeOnly){
			var template = document.querySelector("#" + id);
			return nodeOnly ? template.content.cloneNode(true).children[0] : template.content.cloneNode(true);
		},
		element : function(tagName, attributes, content){
			content = content || "";
			var element = document.createElement(tagName);
			_.forEach(attributes, function(attrValue, attrName){
				element.setAttribute(attrName, attrValue || "");
			});

			element.innerHTML = content;
			return element;
		},
		levelUpPath : function(level, basePath){
			var levelUP = "";
			for (var a = 0; a < level; a++){
				levelUP+="../";
			}	

			return [levelUP, basePath].join("/").replace(/\/\//g, "/");
		},
		shiftPath : function(basePath, targetPath){
			return [basePath, targetPath].join("/").replace(/\/\//g, "/");
		},
		bustPath : function(path){
			return [path, "bust=" + (new Date()).getTime()].join("?");
		},
		fragment : function(els){
			var frag = new DocumentFragment();
			var elements = null;

			if (els instanceof window.Array){
				elements = els;
			} else {
				elements = Array.prototype.slice.call(arguments);
			}

			while(elements.length > 0){
				frag.appendChild(elements.shift());
			}

			return frag;
		},
		defineProperty : function(target, name, data){
			if (typeof data == "function"){
				Object.defineProperty(target, name, {
					value : data,
					writable : true
				});
			} else {
				Object.defineProperty(target, name, data);
			}
		},
		defineProperties : function(target, props){
			_.forEach(props, function(value, name){
				this.defineProperty(target, name, value);
			}.bind(this));
		},
		getUrlLevel : function(url){
			return url.split("/").length - 1;
		},
	});

	window.kek = new ToolChain();

	return new ToolChain();

});

