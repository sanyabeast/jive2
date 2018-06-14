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
			frame.window.isFrame = true;
			frame.window.frame = frame;
			frame.window.activity = frame.activity.url;
			frame.window.requireConfig = this.requireConfig.valueOf(frame.activity.level, "./");
			frame.window.$Class = window.$Class;
			frame.window.$Interface = window.$Interface;
			frame.window.unicycle = window.unicycle;
			frame.window.postal = postal;
			frame.window.android = window.android;
			frame.window.trident = new Trident(frame.window);
		},
	});	

	return FramePatcher;

});