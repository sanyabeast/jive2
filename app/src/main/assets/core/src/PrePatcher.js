"use strict";
define([
		"ToolChain"
	], function(tools){

	var PrePatcher = new $Class({ name : "PrePatcher", namespace : "Core" }, {
		patch : function(window){
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

					return this;
				},
				connect : function(){
					if (this._parentElement){
						this._parentElement.appendChild(this);
						delete this._parentElement;
					}

					return this;
				},
				traverse : function(iteratee, parent){
					iteratee(this, parent || null);

					parent = this;

					_.forEach(this.children, function(child, index){
						child.traverse(iteratee, parent);
					});

					return this;
				}
			});	

			tools.defineProperties(window.HTMLIFrameElement.prototype, {
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
				active : {
					value : false,
					writable : true
				},
				reset : {
					value : function(){
						for (var a = 0; a < this.onDieCallbacks.length; a++){
							this.onDieCallbacks[a]();
						}

						this.params = null;
						this.sourceActivityName = null;
						this.src = "javascript:";
						this.active = false;
					}
				},
				onDieCallbacks : {
					value : [],
				}
			});
		}
	});

	return PrePatcher;

});