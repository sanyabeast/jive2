"use strict";
define([
		"Activity",
		"TokensCollection",
		"FrameDriver",
		"PrePatcher",
		"Subscriber",
		"postal",
		"todo",
		"jsterm",
		"superagent",
	], function(
		  Activity
		, TokensCollection
		, FrameDriver
		, PrePatcher
		, Subscriber
		, postal
		, todo
		, JSTerm
		, superagent){

		window.TokensCollection = TokensCollection;

	/*Jive2Core*/
	var Core = new $Class({ name : "Core", namespace : "Core" }, {
		Activity : { value : Activity },
		TokensCollection : { value : TokensCollection },
		FrameDriver : { value : FrameDriver },
		PrePatcher : { value : PrePatcher },
		Subscriber : { value : Subscriber },
		$constructor : function(){
			this.modules = new TokensCollection({
				frameDriver : new FrameDriver(),
				prePatcher : new PrePatcher(),
				jsterm : new JSTerm()
			});

			this.modules.with("prePatcher", function(prePatcher){
				prePatcher.patch();
			});


			this.setupAndroidBridgeProxy();
			this.createSubs();
			this.modules.list.jsterm.connect();

			if (this.env == "android"){
				for (var k in window._android){
					this.modules.get("jsterm").state.history.push(["android.", k, "()"].join(""));
				}
			}

			this.blobURLs = {};

			document.body.appendChild(this.modules.get("jsterm").element);

			window.postal = postal;
			window.todo = todo;
			window.superagent = superagent;
		},
		env : {
			value : "android",
			writable : true
		},
		setupAndroidBridgeProxy : function(){
			var jive = this;

			var placeholderMethod = function(){
				var args = _.slice(arguments);
				var methodName = args.shift();

				console.warn("Android bridge method is inaccessible");
				console.warn("Method: " + methodName, "arguments: ", args);
				return null;
			};

			this.env = window._android ? "android" : "web";

			window.android = new Proxy(window._android || {}, {
				get : function(target, propName){
					if (typeof target[propName] == "function"){
						return function(){
							try {
								return JSON.parse(target[propName].apply(this, arguments));
							} catch (err){
								return target[propName].apply(this, arguments);
							}
						}.bind(target);
					} else {
						return placeholderMethod.bind(jive, propName);
					}
				}
			});
		},
		createSubs : function(){
			this.subscriptions = {
				eventBridge : postal.listen("$android", function(data){
					if (typeof data == "object" && typeof data.theme == "string"){
						postal.say(data.theme, data.data);
					} else {
						console.warn("Unable to dispatch event");
					}
				}),
				setGloabalVariable : postal.listen("var-global", function(data){
					var varName = data[0];
					var varValue = data[1];

					if (varName){
						window[varName] = varValue;
					}
				}.bind(this)),
				buttonPressed : postal.listen("android.button.pressed", function(data){
					postal.say("button.pressed", {
						keycode : data.mKeyCode
					});
				}.bind(this)),
				logData : postal.listen("console.log", function(data){
					console.log("[console.log]", data);
				}),
				/*test*/
				btnPressed : postal.listen("button.pressed", function(data){
					switch(data.keycode){
						case 4:
							android.exit();
						break;
						case 82:
							this.modules.list.jsterm.toggleConnection();
						break;	
					}
				}.bind(this)),

			};
		},
		load : function(path, name){
			this.modules.with("frameDriver")
			.then(function(frameDriver){
				frameDriver.loadActivity(path, name);
			});
		}
	});

	return Core;

});



