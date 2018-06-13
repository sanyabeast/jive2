"use strict";
define([
		"Subscriber",
		"FrameDriver/Patcher",
		"TokensCollection",
		"ToolChain",
		"Activity",
		"postal",
		"lodash",
	], function(Subscriber, FramePatcher, TokensCollection, tools, Activity, postal, _){

	var FrameDriver = new $Class({name : "FrameDriver", namespace : "Core"}, {
		$constructor : function(){
			this.patcher = new FramePatcher();

			this.frames = new TokensCollection();
			this.activities = new TokensCollection();

			this.subs = new Subscriber(this, {
				"core.frames.inited" : this.__onFrameInited.bind(this)
			});
		},
		__onFrameLoaded : function(frame){
			this.setupFrame(frame);
		},
		__onFrameInited : function(frame){
			frame.classList.remove("loading");
			console.log("Frame inited in " + (+new Date() - frame.startLoadingTime) + "ms");
		},
		setupFrame : function(frame){
			this.patcher.patch(frame);
			frame.head.appendChild(tools.fragment([
				tools.element("link", {
					"rel" : "stylesheet/less" ,
					"type" : "text/css" ,
					"href" : "styles.less",
				}),
				tools.element("link", {
					"rel" : "stylesheet/less" ,
					"type" : "text/css" ,
					"href" : tools.levelUpPath(frame.activity.level, "core/styles/frame.less")
				}),
				tools.element("meta", {
					name : "viewport",
					content : "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
				}),
				/*less.js*/
				tools.element("script", {
					src : tools.levelUpPath(frame.activity.level, "node_modules/less/dist/less.js"),
					"async" : "true"
				}),
			]));

			frame.body.appendChild(tools.fragment([
				tools.element("script", {
					"data-main" : tools.levelUpPath(frame.activity.level, "scripts/app_input"),
					src : tools.levelUpPath(frame.activity.level, "node_modules/requirejs/require.js"),
				}),
			]));	
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
			var frame = this.getFrame(frameID);
			frame.classList.add("loading");
			frame.startLoadingTime = +new Date();
			superagent.get(activity.url).then(function(response){
				postal.say("core.frames.loading.success", {
					frame : frame,
					frameID : frameID,
					path : path,
					name : name
				});

				frame.activity = activity;
				frame.src = activity.url;
			}).catch(function(){
				postal.say("core.frames.loading.failed", {
					frame : frame,
					frameID : frameID,
					path : path,
					name : name
				});

				frame.classList.remove("loading");
			});
		},
	});

	return FrameDriver;

});