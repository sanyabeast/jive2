"use strict";
define(function(){

	var TokensCollection = new $Class({ name : "TokensCollection", namespace : "Core" }, {
		$constructor : function(content){
			this.__content = content || {};
		},
		list : {
			get : function(){
				return this.__content;
			}
		},
		set : function(name, value){
			this.__content[name] =  value;
		},
		get : function(name){
			return this.__content[name] || null;
		},
		contains : function(name){
			return typeof this.__content[name] != "undefined";
		},
		clear : function(){
			this.__content = {};
		},
		remove : function(name){
			delete this.__content[name];
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
			for (var k in this.__content){
				this.with(k, callback, context);
			}
		}
	});

	return TokensCollection;

});