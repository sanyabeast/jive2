"use strict";
define([
		"Activity",
		"TokensCollection",
		"FrameDriver",
		"PrePatcher",
		"Subscriber",
		"AndroidProxy",
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
		, AndroidProxy
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
				jsterm : new JSTerm(),
				androidProxy : new AndroidProxy()
			});

			this.modules.with("prePatcher", function(prePatcher){
				prePatcher.patch();
			});


			window.android = this.modules.list.androidProxy.getProxy();

			this.createSubs();
			this.modules.list.jsterm.connect();

			if (this.env == "android"){
				for (var k in window._android){
					this.modules.get("jsterm").state.history.push(["android.", k, "()"].join(""));
				}
			}

			document.body.appendChild(this.modules.get("jsterm").element);

			window.postal = postal;
			window.todo = todo;
			window.superagent = superagent;
		},
		env : {
			get : function(){
				return window._android ? "android" : "web";
			},
		},
		createSubs : function(){
			this.subscriptions = new Subscriber(this, {
				"$android" : function(data){
					if (typeof data == "object" && typeof data.theme == "string"){
						postal.say(data.theme, data.data);
					} else {
						console.warn("Unable to dispatch event");
					}
				},
				"var-global" : function(data){
					var varName = data[0];
					var varValue = data[1];

					if (varName){
						window[varName] = varValue;
					}
				}.bind(this),
				"android.button.pressed" : function(data){
					postal.say("button.pressed", {
						keycode : data.mKeyCode
					});
				}.bind(this),
				"console.log" : function(data){
					console.log("[console.log]", data);
				},
				"button.pressed" : function(data){
					console.log("Button pressed. KeyCode: " + data.keycode);
					switch(data.keycode){
						case 4:
							android.sysExit();
						break;
						case 82:
							this.modules.list.jsterm.toggleConnection();
						break;	
					}
				}
			});

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



