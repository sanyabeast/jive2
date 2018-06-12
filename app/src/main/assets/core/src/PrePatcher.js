"use strict";
define([
		"ToolChain"
	], function(tools){

	var PrePatcher = new $Class({ name : "PrePatcher", namespace : "Core" }, {
		patch : function(){
			Object.defineProperties(window.Node.prototype, {
				addChild : function(child){
					this.appendChild(child);
				},
				select : function(selector, callback){
					var elements = this.querySelectorAll(selector);
					if (_.isFunction(callback)){
						_.forEach(elements, function(element, index){
							callback(elements, index, elements);
						});
					}
					return elements;
				},
			});	

			Object.defineProperties(HTMLIFrameElement.prototype, {
				window : {
					get : function(){
						return this.contentWindow;
					}
				},
				document : {
					get : function(){
						return this.contentDocument;
					}
				},
				body : {
					get : function(){
						return this.document.body;
					}
				},
				head : {
					get : function(){
						return this.document.head;
					}
				},
			});
		}
	});

	return PrePatcher;

});