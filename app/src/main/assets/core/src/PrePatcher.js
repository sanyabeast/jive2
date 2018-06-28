"use strict";
define([
		"ToolChain"
	], function(tools){

	var PrePatcher = new $Class({ name : "PrePatcher", namespace : "Core" }, {
		patch : function(){
			tools.defineProperties(window.Node.prototype, {
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
				disconnect : function(){
					if (this.parentElement){
						this._parentElement = this.parentElement;
						this.parentElement.removeChild(this);
					}
				},
				connect : function(){
					if (this._parentElement){
						this._parentElement.appendChild(this);
						delete this._parentElement;
					}
				}
			});	

			tools.defineProperties(HTMLIFrameElement.prototype, {
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
				reset : {
					value : function(){
						this.params = null;
						this.sourceActivityName = null;
						this.src = "javascript:";
					}
				},
			});
		}
	});

	return PrePatcher;

});