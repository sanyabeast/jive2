"use strict";
define([
		"three",
		"Trident/SOM"
	], function(THREE, SOM){

	var Trident = new $Class({ name : "Trident", namespace : "Trident" }, {
		SOM : { value : SOM, static : true },
		$constructor : function(globalContext){
			this.globalContext = globalContext;
			console.log(THREE);
		},
		setGlobalContext : function(globalContext){
			
		}
	});

	return Trident;

});