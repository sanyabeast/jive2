"use strict";
define(function(){

	var Activity = new $Class({ name : "Activity", namespace : "Core" }, {
		$constructor : function(path, name){
			this.name = name || "index";
			this.path = path;
			this.escapedPath = path.replace(/\./g, "/");
		},
		escapedPath : {
			value : null,
			writable : true
		},
		path : {
			value : null,
			writable : true
		},
		name : {
			value : null,
			writable : true
		},
		toString : function(){
			return ["apps", this.escapedPath, this.name + ".xml"].join("/");
		},
		alias : {
			value : function(path, name){
				return [path, name].join("/");
			},
			static : true
		}
	});

	return  Activity;

});