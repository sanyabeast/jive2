"use strict";
/*Jive2Core*/
var JiveCore = function(){
	this.__setupEvents();
	this.__setupAndroidBridgeProxy();
	this.__createSubs();

	console.log(typeof window.android);
	console.log(window.android.showToast);

	window.addEventListener("DOMContentLoaded", this.__onDOMContentLoaded.bind(this));
};

JiveCore.prototype = {
	__setupAndroidBridgeProxy : function(){
		var placeholderMethod = function(){
			console.warn("Android bridge method is inaccessible");
			return null;
		};

		window.android = new Proxy(window._android || {}, {
			get : function(target, propName){
				if (typeof target[propName] == "function"){
					return target[propName].bind(target);
				} else {
					return placeholderMethod;
				}
			}
		});
	},
	__createSubs : function(){
		this.subscriptions = {
			eventBridge : postal.listen("android::bridge", function(data){
				console.log(data);
				if (typeof data == "object" && typeof data.channel == "string" && typeof data.topic == "string"){
					postal.publish({
						channel : data.channel,
						topic : data.topic,
						data : data.data
					});
				} else {
					console.warn("JIVE: unable to dispatch event");
				}
			}),
			showToast : postal.listen("android::showToast", function(message){
				android.showToast(message);
			}),
			finishApp : postal.listen("android::finish", function(){
				android.finish();
			}),
			exitApp : postal.listen("android::exit", function(){
				android.exit();
			}),
			buttonPressed : postal.listen("android::button.pressed", function(data){
				postal.say("button::pressed", {
					keycode : data.mKeyCode
				});
			}),
			/*test*/
			btnPressed : postal.listen("button::pressed", function(data){
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
	__onDOMContentLoaded : function(){
		this.iframe = document.querySelector("#iframe");
		this.iframe.addEventListener("load", this.__onIframeLoaded.bind(this));
		this.iframe.window = window.frames[0].window;
	},
	__onIframeLoaded : function(evt){
		this.iframe.window.postal = window.postal;
		this.iframe.window.android = window.android;
		this.iframe.window.core = this;
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
	load : function(){
		if (!this.iframe){
			todo.add("load", todo.in(300), function(){
				this.load.apply(this, arguments);
			}.bind(this));
		} else {
			this.iframe.src = "./test/index.html";
		}
	},
};

window.core = new JiveCore();



