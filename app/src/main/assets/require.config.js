define(function(){

	var RequireConfig = function(){
		this.level = 2;

		this.paths = {
			core			: "core/src",
			requireConfig   : "require.config",
			/*vendor libs*/
			OBJLoader		: "core/libs/OBJLoader",
			/*local libs*/
			Trident		    : "core/src/Trident",
			Interactor		: "core/src/Interactor",
			ResLoader 		: "core/src/ResLoader",
			/*node_modules*/
			postal 			: "node_modules/postal/postal",
			todo 			: "node_modules/todojs/todo",
			jsterm 			: "node_modules/jsterm/jsterm",
			lodash 			: "node_modules/lodash/lodash",
			three   		: "node_modules/three/build/three",
			threeOrbit 		: "node_modules/three-orbit-controls/index",
			superagent 		: "node_modules/superagent/superagent",
			tweener 		: "node_modules/tweener/tweener",
			unicycle 		: "node_modules/unicycle/unicycle",
			dollaclass 		: "node_modules/dollaclass/dollaclass",
			jquery			: "node_modules/jquery/dist/jquery.min",
			howler			: "node_modules/howler/dist/howler.min",
			vue 			: "node_modules/vue/dist/vue.min",
			vuex			: "node_modules/vuex/dist/vuex.min",
			bezierEasing	: "node_modules/bezier-easing/src/index",
			matter 			: "node_modules/matter-js/build/matter.min",
			zingtouch       : "node_modules/zingtouch/dist/zingtouch.min"
		};

		this.baseUrl = "core/src/";
	};

	RequireConfig.prototype = {
		valueOf : function(level, baseUrl){
			var config = {};

			level = level || this.level;
			baseUrl = baseUrl || this.baseUrl;

			if (typeof level == "undefined"){
				level = this.level;
			}

			config.baseUrl = baseUrl;
			config.paths = {};
			config.urlArgs = "bust=" + (new Date()).getTime();

			this.forEach(this.paths, function(path, name){
				config.paths[name] = this.levelUpPath(level, path).replace(/\/\//g, "/");		
			}.bind(this));

			return config;
		},
		levelUpPath : function(level, basePath){
			var levelUP = "";
			for (var a = 0; a < level; a++){
				levelUP+="../";
			}	

			return [levelUP, basePath].join("/");
		},
		forEach : function(list, iteratee){
			for (var k in list){
				iteratee(list[k], k, list);
			}

			return this;
		}
	};

	window.requireConfig = new RequireConfig();

	return RequireConfig;

});