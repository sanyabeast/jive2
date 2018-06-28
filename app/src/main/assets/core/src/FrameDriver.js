"use strict";
define([
		"Subscriber",
		"FrameDriver/Patcher",
		"TokensCollection",
		"ToolChain",
		"postal",
		"lodash",
	], function(Subscriber, FramePatcher, TokensCollection, tools, postal, _){

	var FrameDriver = new $Class({name : "FrameDriver", namespace : "Core"}, {
		$constructor : function(){
			this.patcher = new FramePatcher();

			this.activities = new TokensCollection();

			this.subs = new Subscriber(this, {
				"activity.inited" : this.$onActivityInited.bind(this)
			});
		},
		$onFrameLoaded : function(frame){
			if (frame.src == "javascript:" || !frame.src){
				return;
			}
			
			this.setupFrame(frame);
		},
		$onActivityInited : function(activityName){
			var frame = this.getActivityFrame(activityName);
			
			frame.classList.remove("loading");
			this.setActiveFrame(frame.activityName);
			console.log("Frame inited in " + (+new Date() - frame.startLoadingTime) + "ms");
		},
		setupFrame : function(frame){
			var urlLevel = tools.getUrlLevel(frame.src);

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
					"href" : tools.levelUpPath(urlLevel, "core/styles/frame.less")
				}),
				tools.element("meta", {
					name : "viewport",
					content : "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
				}),
				tools.template("less-config-template"),
				tools.element("script", {
					src : tools.bustPath(tools.levelUpPath(urlLevel, "node_modules/less/dist/less.js")),
					defer : ""
				}),
			]));

			frame.body.appendChild(tools.fragment([
				tools.element("script", {
					"data-main" : tools.levelUpPath(urlLevel, "core/app_main"),
					src : tools.bustPath(tools.levelUpPath(urlLevel, "node_modules/quire/quire.js")),
				}),
				
			]));	

		},
		getActivityFrame : function(name){
			var frame;

			if (!this.activities.contains(name)){
				frame = tools.template("frame-driver-frame", true);
				frame.setAttribute("data-frame-id", name);
				frame.activityName = name;
				document.querySelector("body").appendChild(frame);
				this.activities.set(name, frame);
				frame.addEventListener("load", this.$onFrameLoaded.bind(this, frame));
			} 

			return this.activities.get(name);
		},
		setActiveFrame : function(_activityName){
			this.activities.iterate(function(frame, activityName){
				if (activityName != _activityName){
					frame.reset();
					frame.style.display = "none";
				} else {
					frame.style.display = "flex";
				}
			}, this);
		},
		launchActivity : function(activityName, params, sourceActivityName){
			var activityFrame = this.getActivityFrame(activityName);
			var url = ["apps", activityName, "index.html"].join("/");

			activityFrame.classList.add("loading");
			activityFrame.startLoadingTime = +new Date();
			activityFrame.sourceActivityName = sourceActivityName;
			activityFrame.params = params;
			activityFrame.connect();

			superagent.get(url).then(function(response){
				activityFrame.src = url;

				postal.say("core.activity.loading.success", {
					activityName : activityName,
					params : params
				});

			}).catch(function(){
				postal.say("core.activity.loading.failed", {
					activityName : activityName,
					params : params
				});

				activityFrame.classList.remove("loading");
			});
		},
	});

	return FrameDriver;

});