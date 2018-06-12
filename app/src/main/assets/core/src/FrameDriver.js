"use strict";
define([
		"TokensCollection",
		"ToolChain",
		"Activity",
	], function(TokensCollection, tools, Activity){

	var FrameDriver = new $Class({name : "FrameDriver", namespace : "Core"}, {
		$constructor : function(){
			this.frames = new TokensCollection();
			this.activities = new TokensCollection();
		},
		getFrame : function(id){
			var frame;

			if (!this.frames.contains(id)){
				frame = tools.template("frame-driver-frame", true);
				frame.setAttribute("data-frame-id", id);
				document.querySelector("body").appendChild(frame);
				this.frames.set(id, frame);
			} 

			return this.frames.get(id);
		},
		setActiveFrame : function(id){
			this.frames.iterate(function(frame, frameID){
				if (id != frameID){
					frame.style.display = "none!important";
				} else {
					frame.style.display = "";
				}
			}, this);
		},
		getActivity : function(path, name){
			var activity;
			var alias = Activity.alias(path, name);

			if (!this.activity.contains(alias)){
				activity = new Activity(path, name);
				this.activities.set(alias, activity);
			}

			return this.activities.get(alias);
		}
	});

	return FrameDriver;

});