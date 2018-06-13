"use strict";
define(function(){

	var AndroidProxy = new $Class({ name : "AndroidProxy", namespace : "Core" }, {
		placeholderMethod : function(){
			var args = _.slice(arguments);
			var methodName = args.shift();

			console.warn("Android bridge method is inaccessible");
			console.warn("Method: " + methodName, "arguments: ", args);
			return null;
		},
		getProxy : function(){
			var _this = this;

			var proxy = new Proxy(window._android || {}, {
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
						return _this.placeholderMethod.bind(_this, propName);
					}
				}
			});

			return proxy;
		}
	});

	return AndroidProxy;

});