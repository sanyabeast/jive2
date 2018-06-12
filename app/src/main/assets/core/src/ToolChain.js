"use strict";
define(function(){

	var ToolChain = new $Class({ name : "ToolChain", namespace : "Core" }, {
		template : function(id, nodeOnly){
			var template = document.querySelector("#" + id);
			return nodeOnly ? template.content.cloneNode(true).children[0] : template.content.cloneNode(true);
		}
	});

	return new ToolChain();

});

