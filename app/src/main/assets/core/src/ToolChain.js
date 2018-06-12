"use strict";
define(function(){

	var ToolChain = new $Class({ name : "ToolChain", namespace : "Core" }, {
		template : function(id, nodeOnly){
			var template = document.querySelector("#" + id);
			return nodeOnly ? template.content.cloneNode(true).children[0] : template.content.cloneNode(true);
		},
		levelUpPath : function(level, basePath){
			var levelUP = "";
			for (var a = 0; a < level; a++){
				levelUP+="../";
			}	

			return [levelUP, basePath].join("/");
		},
		shiftPath : function(basePath, targetPath){
			return [basePath, targetPath].join("/");
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
		}
	});

	window.kek = new ToolChain();

	return new ToolChain();

});

