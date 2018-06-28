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

		},
		loadTemplates : function(document){
			var result = {};
			var templates = document.body.querySelectorAll("template");

			for  (var a = 0, l = templates.length, id; a < l; a++){
				id = templates[a].id;
				result[id] = {
					dom : templates[a].content.cloneNode(true),
					html : templates[a].innerHTML
				};	
			}

			return result;

		}
	});

	return R;

});