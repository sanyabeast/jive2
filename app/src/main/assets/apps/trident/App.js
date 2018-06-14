"use strict";
define("App", function(){

	var App =  new $Class({ name : "App" }, {
		$constructor : function(){
			this.scene = trident.parse(document.querySelector("#test-scene").content.cloneNode(true).children[0]);
		}
	});

	return App;

});