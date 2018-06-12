"use strict";
define([
		"TokensCollection",
		"ToolChain",
		"Activity",
		"postal",
		"lodash",
	], function(TokensCollection, tools, Activity, postal, _){

	var FrameDriver = new $Class({name : "FrameDriver", namespace : "Core"}, {
		$constructor : function(){
			this.frames = new TokensCollection();
			this.activities = new TokensCollection();
		},
		__onFrameLoaded : function(frame){
			frame.contentWindow.postal = postal;
		},
		getFrame : function(id){
			var frame;

			if (!this.frames.contains(id)){
				frame = tools.template("frame-driver-frame", true);
				frame.setAttribute("data-frame-id", id);
				frame.id = ["frame", id].join("_");
				document.querySelector("body").appendChild(frame);
				this.frames.set(id, frame);
				frame.addEventListener("load", this.__onFrameLoaded.bind(this, frame));
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

			if (!this.activities.contains(alias)){
				activity = new Activity(path, name);
				this.activities.set(alias, activity);
			}

			return this.activities.get(alias);
		},
		loadActivity : function(path, name, frameID){
			var activity = this.getActivity(path, name);
			activity.make().then(function(url){
				this.loadURL(url);
			}.bind(this));	
		},
		loadURL : function(url, frameID){
			frameID = frameID || "root";
			var frame = this.getFrame(frameID);
			frame.src = url;
		}
	});

	return FrameDriver;

});