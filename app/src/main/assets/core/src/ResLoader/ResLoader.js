"use strict";
define([
		"postal",
		"ResLoader/Loaders",
		"howler",
	], function(postal, Loaders){

	var R = new $Class({ name : "R", namespace : "Core" }, {
		$constructor : function(){
			this.content = {};
		},
		loaders : {
			value : new Loaders()
		},
		load : function(resources){

		},
		loadTemplates : function(document){
			var result = {};
			var templates = document.body.querySelectorAll("template");

			for  (var a = 0, l = templates.length, id; a < l; a++){
				id = templates[a].id;
				result[id] = {
					dom : templates[a].content.cloneNode(true),
					html : templates[a].innerHTML
				};	
			}

			return result;

		},
		loadVueComponents : function(document, Vue){
			var result = {};
			var templates = document.body.querySelectorAll("template.vue-component");

			_.forEach(templates, function(templateNode){
				var innerScriptParams = {};
				var innerScript = templateNode.content.querySelector("script");
				var componentParams;

				if (innerScript){
					innerScript = innerScript.cloneNode(true);
					try { innerScriptParams = eval(["var p = {", innerScript.innerHTML, "};p;"].join("")); } catch (err){
						console.error(err);
					}
				}

				var id = templateNode.id;
				var props = templateNode.getAttribute("props");
				props = props ? props.split(" ") : [];

				componentParams = {
					template: templateNode.innerHTML,
					props : props,
					data : innerScriptParams.data,
					methods : innerScriptParams.methods
				};

				result[id] = Vue.component(id, componentParams);
			});

			console.log(result);
			return result;

		}
	});

	return R;

});