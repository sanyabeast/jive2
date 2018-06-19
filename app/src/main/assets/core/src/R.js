"use strict";
define([
		"TokensCollection",
		"postal",
		"R/Loaders",
		"howler"
	], function(TokensCollection, postal, Loaders){

	var R = new $Class({ name : "R", namespace : "Core" }, {
		$constructor : function(){
			this.content = {};
		},
		loaders : {
			value : new Loaders()
		},
		load : function(resources){

		}
	});

	return R;

});