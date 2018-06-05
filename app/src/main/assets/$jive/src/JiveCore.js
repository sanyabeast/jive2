"use strict";
define([
		"postal",
		"todo",
		"jsterm"
	], function(postal, todo, JSTerm){

	/*Jive2Core*/
	var JiveCore = function(){
		this.__setupAndroidBridgeProxy();
		this.__patchProtos();
		this.__patchConsole();
		this.__setupEvents();
		this.__createSubs();

		this.jsterm = new JSTerm();

		this.jsterm.connect();
		document.body.appendChild(this.jsterm.element);

		window.postal = postal;
		window.todo = todo;

		var debugTextArea = document.querySelector("#debug")

	};

	JiveCore.prototype = {
		env : "android",
		get iframe(){
			if (!this._iframe){
				this._iframe = document.querySelector("#iframe");
				if (this._iframe){
					this.iframe.addEventListener("load", this.__onIframeLoaded.bind(this));
					this.iframe.window = window.frames[0].window;
				}
			}

			return this._iframe;
		},
		__setupAndroidBridgeProxy : function(){
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
						return target[propName].bind(target);
					} else {
						return placeholderMethod.bind(jive, propName);
					}
				}
			});
		},
		__createSubs : function(){
			this.subscriptions = {
				eventBridge : postal.listen("android.bridge", function(data){
					if (typeof data == "object" && typeof data.theme == "string"){
						postal.say(data.theme, data.data);
					} else {
						console.warn("Unable to dispatch event");
					}
				}),
				showToast : postal.listen("android.showToast", function(message){
					android.showToast(message);
				}),
				finishApp : postal.listen("android.finish", function(){
					android.finish();
				}),
				exitApp : postal.listen("android.exit", function(){
					android.exit();
				}),
				buttonPressed : postal.listen("android.button.pressed", function(data){
					postal.say("button.pressed", {
						keycode : data.mKeyCode
					});

					if (data.mKeyCode == 82){
						this.jsterm.toggleConnection();
					}
				}.bind(this)),
				logData : postal.listen("console.log", function(data){
					console.log("[console.log]", JSON.stringify(data));
				}),
				/*test*/
				btnPressed : postal.listen("button.pressed", function(data){
					switch(data.keycode){
						case 4:
							android.exit();
						break;
						case 24:
							android.showToast("privet");
						break;
						case 25:
							android.showToast(new Date().toString());
						break;
					}
				}),

			};
		},
		__setupEvents : function(){
			this.events = {
				jiveReady : new Event("jive.ready")
			};
		},
		__onIframeLoaded : function(evt){
			this.iframe.window.postal = postal;
			this.iframe.window.todo = todo;
			this.iframe.window._ = window._;
			this.iframe.window.android = window.android;
			this.iframe.window.core = this;
			this.__patchConsole(this.iframe.window.console, "frame");
			this.iframe.window.dispatchEvent(this.events.jiveReady);

		},
		__loop : function(list, callback, context){
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
		__patchConsole : function(console, namespace){
			console = console || window.console;
			namespace = namespace || "";
			var core = this;

			_.forEach(["log", "warn", "error", "info"], function(method){
				var native = console[method];
				console[method] = function(){
					var args = _.slice(arguments);

					if (core.env == "android"){
						/*_.forEach(args, function(arg, index, list){
							list[index] = arg.toString ? arg.toString() : arg;
						});*/

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
		__patchProtos : function(){

		},
		load : function(){
			if (!this.iframe){
				todo.add("load", todo.in(100), function(){
					this.load.apply(this, arguments);
				}.bind(this));
			} else {
				this.iframe.src = "./test/index.html";
			}
		},

	};

	return JiveCore;

});



