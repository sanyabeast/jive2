"use strict";
define(function(){

	var TokensCollection = new $Class({ name : "TokensCollection", namespace : "Core" }, {
		$constructor : function(content){
			if (content){
				this.setMultiple(content);
			}
		},
		set : function(name, value){
			this[name] =  value;
		},
		setMultiple : function(data){
			for (var k in data){
				this.set(k, data[k]);
			}
		},
		get : function(name){
			return this[name] || null;
		},
		contains : function(name){
			return typeof this[name] != "undefined";
		},
		clear : function(){
			
		},
		remove : function(name){
			delete this[name];
		},
		with : function(name, callback, context){
			if (_.isFunction(callback)){
				callback.call(context, this.get(name), name, this);
			} else {
				return new Promise(function(resolve, reject){
					resolve(this.get(name));
				}.bind(this));
			}
		},
		iterate : function(callback, context){
			for (var k in this){
				this.with(k, callback, context);
			}
		}
	});

	return TokensCollection;

});