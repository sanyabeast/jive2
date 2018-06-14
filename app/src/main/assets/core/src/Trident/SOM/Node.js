"use strict";
define([
		"Trident/SOM/Node/Atlas"
	], function(Atlas){

	var Node = new $Class({ name : "Node", namespace : "Trident.SOM" }, {
		$constructor : function(dom){
			this.atlas = new Atlas();
			this.state = {
				tagName : null
			};
			this.__content = null;
			this.dom = dom;
		},
		attributes : {
			get : function(){
				return (this.dom && this.dom.attributes) ? this.dom.attributes : {};
			}
		},
		tagName : {
			get : function(){
				return (this.dom && this.dom.tagName) ? this.dom.tagName : {};
			}
		},
		classList : {
			get : function(){
				return (this.dom && this.dom.classList) ? this.dom.classList : {};
			}
		},
		parentNode : function(){
			return(this.dom.parentNode && this.dom.parentNode.som instanceof Node) ? this.dom.parentNode.som : null;
		},
		dom : {
			set : function(dom){
				this.__dom = dom;
				dom.som = this;
				this.sync();
			},
			get : function(){
				return this.__dom;
			}
		},
		sync : function(){
			var dom = this.__dom;

			if (dom.tagName != this.state.tagName){
				this.syncTag(dom.tagName);
			}
		},
		syncTag : function(tagName){
			this.subject = this.atlas.$reach(tagName, this.attributes, this.parentNode);
		}
	});

	return Node;

});