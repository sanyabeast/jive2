"use strict";
define([
		"postal",
		"todo",
		"requireConfig",
		"Trident/Trident"
	], function(postal, todo, RequireConfig, Trident){

	var FramePatcher = new $Class({ name : "FramePatcher", namespace : "Core.FrameDriver" }, {
		$constructor : function(){
			this.requireConfig = new RequireConfig();
		},
		patch : function(frame){
			frame.window.frame = frame;
			frame.window.activity = frame.activity.url;
			frame.window.requireConfig = frame.window.require = this.requireConfig.valueOf(frame.activity.level, "./");
			frame.window.$Class = window.$Class;
			frame.window.$Interface = window.$Interface;
			frame.window.postal = postal;
			frame.window.android = window.android;
			frame.window.trident = new Trident(frame.window);
		},
	});	

	return FramePatcher;

});