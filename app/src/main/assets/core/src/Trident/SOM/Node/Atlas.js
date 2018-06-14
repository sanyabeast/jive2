"use strict";
define(function(){

	var Atlas = new $Class({ name : "Atlas", namespace : "Trident.SOM.Node" }, {
		$constructor : function(dom){
			
		},
		$reach : function(type, attributes, parent){
			for (var k in attributes){
				console.log(k)
			}
			console.log(type, attributes, parent);
		},
		renderer : {
			construct : function(){

			}
		}
	});

	return Atlas;

});