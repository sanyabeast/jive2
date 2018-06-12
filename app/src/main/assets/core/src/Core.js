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
				prePatcher : new PrePatcher()
			});

			this.modules.with("prePatcher", function(prePatcher){
				prePatcher.patch();
			});


			this.setupAndroidBridgeProxy();
			this.setupEvents();
			this.createSubs();
			this.patchProto();

			this.jsterm = new JSTerm();
			// this.jsterm.connect();

			if (this.env == "android"){
				for (var k in window._android){
					this.jsterm.state.history.push(["android.", k, "()"].join(""));
				}
			}

			this.blobURLs = {};

			document.body.appendChild(this.jsterm.element);

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
							this.jsterm.toggleConnection();
						break;	
					}
				}.bind(this)),

			};
		},
		setupEvents : function(){
			this.events = {
				jiveReady : new Event("jive.ready")
			};
		},
		onIframeLoaded : function(evt){
			this.iframe.window.postal = postal;
			this.iframe.window.todo = todo;
			this.iframe.window._ = window._;
			this.iframe.window.android = window.android;
			this.iframe.window.core = this;
			this.patchConsole(this.iframe.window.console, "frame");
			this.iframe.window.dispatchEvent(this.events.jiveReady);

		},
		loop : function(list, callback, context){
			if (typeof list.length == "number"){
				for (var a = 0, l = list.length; a < l; a++){
					callback.call(context, list[a], a, list);
				}
			} else {	
				for (var a in list){
					callback.call(context, list[a], a, list);
				}
			}
		},
		patchConsole : function(console, namespace){
			return;
			console = console || window.console;
			namespace = namespace || "";
			var core = this;

			_.forEach(["log", "warn", "error", "info"], function(method){
				var native = console[method];
				console[method] = function(){
					var args = _.slice(arguments);

					if (core.env == "android"){
						args.unshift(["JiveJS", namespace].join(":") + ": ");
						native.call(console, args.join(" "));
					} else {
						args.unshift("color: #9c27b0; font-weight: bold");
						args.unshift(["%cJiveJS", namespace].join(":") + ": ");
						native.apply(console, args);
					}
				};
			}.bind(this));
		},
		patchProto : function(){
			var _this = this;
			Node.prototype.select = function(selector, callback, context){
				var elements = this.querySelectorAll(selector);
				if (callback){
					_this.loop(elements, function(element, index, list){
						callback.call(context, element, index, list);
					});
				}

				return elements;
			}
		},
		load : function(path, name){
			this.modules.with("frameDriver")
			.then(function(frameDriver){
				frameDriver.loadActivity(path, name);
			});

			console.log(arguments);
		}
	});

	return Core;

});



