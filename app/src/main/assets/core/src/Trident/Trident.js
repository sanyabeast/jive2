"use strict";
define([
		"three",
		"Trident/SOM"
	], function(THREE, SOM){

	var Trident = new $Class({ name : "Trident", namespace : "Trident" }, {
		SOM : { value : SOM, static : true },
		$constructor : function(globalContext){
			this.som = new SOM();
			this.globalContext = globalContext;
			// console.log(THREE);
		},
		setGlobalContext : function(globalContext){
			this.som.setGlobalContext(globalContext);
		},
		parse : function(data){
			return this.som.make(data);
		},
		THREE : {
			get : function(){ return THREE; }
		}
	});

	return Trident;

});