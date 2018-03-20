"use strict";
/*Jive2Core*/
var JiveCore = function(){
	this.__setupAndroidBridgeProxy();
	this.__createSubs();

	console.log(typeof window.android);
	console.log(window.android.showToast);
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
	load : function(){
		var xhr = new XMLHttpRequest();
		xhr.open("get", "./test/index.html", false);
		xhr.send();
		console.log(xhr.responseText);
	}
};

window.core = new JiveCore();



