"use strict";
define(function(){

	var SceneObjectModel = new $Class({ name : "SOM", namespace : "Trident" }, {
		$constructor : function(){

		},
		html2dom : function(html){
			var div = document.createElement("div");
			div.innerHTML = html;
			var result = div.children[0];
			div.remove();
			return result;
		},
	});

});