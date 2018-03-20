"use strict";
/*Jive2Core*/
var JiveCore = function(){
	this.domParser = new DOMParser();
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
		var xhr = new XMLHttpRequest();
		xhr.open("get", "./test/index.html", false);
		xhr.send();

		var dom = this.parseHTML(xhr.responseText);

		this.integrateDOM(dom);
	},
	parseHTML : function(html){
		var fragment = this.domParser.parseFromString(html, "text/html");
		return fragment;
	},
	integrateDOM : function(dom){
		var bodyFragment = new DocumentFragment();
		var headFragment = new DocumentFragment();

		var bodyChildren;
		var headChildren;

		if (dom.body && dom.body.childNodes && dom.body.childNodes.length){
			bodyChildren = Array.prototype.slice.apply(dom.body.childNodes);

			this.__loop(bodyChildren, function(node, index){
				bodyFragment.appendChild(node);
			}, this);

			this.__revokeScripts(bodyFragment);
		}

		if (dom.head && dom.head.childNodes && dom.head.childNodes.length){
			headChildren = Array.prototype.slice.apply(dom.head.childNodes);
			this.__loop(headChildren, function(node, index){
				headFragment.appendChild(node);
			}, this);

			this.__revokeScripts(headFragment);
		}

		document.head.appendChild(headFragment);
		document.body.appendChild(bodyFragment);
	},
	__revokeScripts : function(fragment){
		var scripts = fragment.querySelectorAll("script");

		this.__loop(scripts, function(scriptNode, index){
			scriptNode.replaceWith(this.__revokeScript(scriptNode));
		}, this);
	},
	__revokeScript : function(scriptNode){
		var newScriptNode = document.createElement("script");

		this.__loop(scriptNode.attributes, function(attr, index){
			newScriptNode.setAttribute(attr.name, attr.value);
		});

		newScriptNode.innerHTML = scriptNode.innerHTML;

		return newScriptNode;
	}
};

window.core = new JiveCore();



