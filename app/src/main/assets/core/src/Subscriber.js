"use strict";
define([
		"postal"
	], function(postal){

	var Subscriber = new $Class({ name : "Subscriber", namespace : "Core" }, {
		$constructor : function(context, subscribtions){
			/**Объект, хранящий список пописок
			  */
			this._context = context;
			this._content = this.__createSubscriptions(context, subscribtions);
		},
		add : function(eventID, callback){
			this._content = this._content || {};
			this._content[eventID] = postal.listen(eventID, callback, this._context);
		},
		__createSubscriptions : function(context, subscribtions){
			var subs = {};

			for (var k in subscribtions){
				subs[k] = postal.listen(k, subscribtions[k], context);
			}

			return subs;
		}
	});


	return Subscriber;

});