"use strict";
define([
		"three",
		"Trident/SOM"
	], function(THREE, SOM){

	var Trident = new $Class({ name : "Trident", namespace : "Trident" }, {
		$constructor : function(){
			console.log(THREE);
		}
	});

	return Trident;

});