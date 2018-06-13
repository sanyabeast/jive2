"use strict";
define([
		"ToolChain",
		"postal",
		"superagent"
	], function(tools, postal, superagent){

	var Activity = new $Class({ name : "Activity", namespace : "Core" }, {
		$constructor : function(path, name){
			this.name = name || "index";
			this.path = path;
		},
		url : {
			get : function(){
				return [this.normalizedPath, this.normalizedName].join("/");
			},
		},
		level : {
			get : function(){
				return this.path.split(".").length + 1;
			}
		},
		normalizedName : {
			get : function(){
				return this.name + ".html";
			},
		},
		normalizedPath : {
			get : function(){
				return "apps/" + this.path.replace(/\./g, "/");
			},
		},
		path : {
			value : null,
			writable : true
		},
		name : {
			value : null,
			writable : true
		},
		alias : {
			value : function(path, name){
				name = name || "index";
				return ["apps/" + path.replace(/\./g, "/"), name + ".html"].join("/");
			},
			static : true
		}
	});

	window.Activity = Activity;

	return  Activity;

});