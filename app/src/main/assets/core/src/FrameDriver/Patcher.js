"use strict";
define([
		"postal",
		"todo",
		"requireConfig"
	], function(postal, todo, RequireConfig){

	var FramePatcher = new $Class({ name : "FramePatcher", namespace : "Core.FrameDriver" }, {
		$constructor : function(){
			this.requireConfig = new RequireConfig();
		},
		patch : function(frame){
			frame.window.frame = frame;
			frame.window.activity = frame.activity.url;
			frame.window.requireConfig = this.requireConfig.valueOf(frame.activity.level, "./");
			frame.window.postal = postal;
			frame.window.android = window.android;
		},
	});	

	return FramePatcher;

});