"use strict";
define([
		"ResLoader/ResLoader",
		"TokensCollection",
		"FrameDriver",
		"PrePatcher",
		"Subscriber",
		"AndroidProxy",
		"unicycle",
		"postal",
		"todo",
		"jsterm",
		"superagent",
		"matter",
	], function(
		  ResLoader
		, TokensCollection
		, FrameDriver
		, PrePatcher
		, Subscriber
		, AndroidProxy
		, Unicycle
		, postal
		, todo
		, JSTerm
		, superagent
		, matter
		){

	window.matter = matter;
	window.TokensCollection = TokensCollection;

	/*Jive2Core*/
	var Core = new $Class({ name : "Core", namespace : "Core" }, {
		TokensCollection : { value : TokensCollection },
		FrameDriver : { value : FrameDriver },
		PrePatcher : { value : PrePatcher },
		Subscriber : { value : Subscriber },
		$constructor : function(){
			this.combo = "";

			this.modules = new TokensCollection({
				frameDriver : new FrameDriver(),
				prePatcher : new PrePatcher(),
				jsterm : new JSTerm(),
				androidProxy : new AndroidProxy(),
				unicycle : new Unicycle,
				r : new ResLoader()
			});

			this.modules.unicycle.start();

			this.modules.with("prePatcher", function(prePatcher){
				prePatcher.patch(window);
			});


			window.android = this.modules.androidProxy.getProxy();

			this.createSubs();
			if (this.env == "android"){
				// this.modules.jsterm.connect();
			}

			this.modules.jsterm.onHistoryUpdated = function(history){
				android.storageSet("core", "jsterm.history", JSON.stringify(history));
			};

			var jstermHistory = android.storageGet("core", "jsterm.history");

			try {
				if (Array.isArray(jstermHistory)){
					this.modules.jsterm.putHistory(jstermHistory);					
				}
				console.log("jsterm history loaded");
			} catch (err){}

			// if (this.env == "android"){
			// 	for (var k in window._android){
			// 		this.modules.get("jsterm").state.history.push(["android.", k, "()"].join(""));
			// 	}
			// }

			document.body.appendChild(this.modules.get("jsterm").element);

			window.unicycle = this.modules.unicycle;
			window.postal = postal;
			window.todo = todo;
			window.superagent = superagent;
			window.R = this.modules.r;
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
						case 24:
							this.combo += "u";
							android.sysKeyPress(data.keycode);
						break;
						case 25:
							this.combo += "d";
							android.sysKeyPress(data.keycode);
						break;
						case 82:
							this.modules.jsterm.toggleConnection();
						break;	
					}

					if (this.combo.match(/uuddud/)){
						this.combo = "";
						this.modules.jsterm.toggleConnection();
					}
				},
				"intent" : function(data){
					console.log(data);
					this.load(data.target, data.params, data.source);
				},
				"core.preloader.show" : this.showCorePreloader,
				"core.preloader.hide" : this.hideCorePreloader,
				"core.frames::kill-activity" : function(data){
					this.modules.frameDriver.killActivity(data.activityName);
				},
				"$resloader.loading.started" : this.showCoreLoader,
				"$resloader.loading.finished" : this.hideCoreLoader,
				"$resloader.loading.progress" : function(data){
					this.setCoreLoaderProgress(data.value);
				}
			});

		},
		load : function(activityName, params, sourceActivityName){
			this.modules.frameDriver.launchActivity(activityName, params, sourceActivityName);
		},
		showCorePreloader : function(){
			document.querySelector("#core-preloader").classList.add("active");
		},
		hideCorePreloader : function(){
			document.querySelector("#core-preloader").classList.remove("active");
		},
		showCoreLoader : function(){
			document.querySelector("#core-loader").classList.add("active");
		},
		hideCoreLoader : function(){
			todo.add("core/loader/hide", todo.in(todo.seconds(0.3)), function(){
				document.querySelector("#core-loader").classList.remove("active");
			}.bind(this))
		},
		setCoreLoaderProgress : function(value){
			document.querySelector("#core-loader .progress-bar .progress").style.width = (value * 100) + "%";
		}
	});

	return Core;

});



