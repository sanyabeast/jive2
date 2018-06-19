"use strict";
define([
		"Trident/SOM/Node"
	], function(Node){

	var SceneObjectModel = new $Class({ name : "SOM", namespace : "Trident" }, {
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
		make : function(data){
			var dom;

			if (typeof data == "string"){
				dom = this.parseHTML(data);
			} else {
				dom = data;
			}



			return new Node(dom, true);
		},

	});

	return SceneObjectModel;

});