"use strict";
define([
		"postal",
		"todo",
		"requireConfig",
		"Trident/Trident",
		"ToolChain"
	], function(postal, todo, RequireConfig, Trident, tools){

	var FramePatcher = new $Class({ name : "FramePatcher", namespace : "Core.FrameDriver" }, {
		$constructor : function(){
			this.requireConfig = new RequireConfig();
		},
		patch : function(frame){
			frame.window.source = frame.sourceActivityName || null;
			frame.window.params = frame.params || null;
			frame.window.current = frame.activityName;
			frame.window.requireConfig = this.requireConfig.valueOf(tools.getUrlLevel(frame.url), "./");
			frame.window.$postal = postal;
			frame.window.android = window.android;
			frame.window.intent = this.$intent.bind(this, frame.activityName);
			frame.window.die = this.$die.bind(this, frame.activityName);
		},
		$intent : function(source, target, params){
			postal.say("intent", {
				source : source,
				target : target,
				params : params
			})
		},
		$die : function(source){
			postal.say("core.frames::kill-activity", {
				activityName : source
			});
		}
	});	

	return FramePatcher;

});