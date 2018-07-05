"use strict";
define([
		"Trident/SOM/Node"
	], function(Node){

	var SceneObjectModel = new $Class({ name : "SOM", namespace : "Trident" }, {
		Node : {
			static : true,
			value : Node
		},
		$constructor : function(){

		},
		setGlobalContext : function(context){

		},	
		parseHTML : function(html){
			var div = document.createElement("div");
			div.innerHTML = html;
			var result = div.children[0];
			div.remove();
			return result;
		},
		make : function(template, data){
			if (typeof template, data == "string"){
				template = this.parseHTML(template, data);
			} else {
				template = template;
			}

			template = this.preprocessTemplate(template, data);

			return new Node(template, true, data);
		},
		preprocessTemplate : function(template, data){
			data = data || {};
			return template;
		}
	});

	return SceneObjectModel;

});