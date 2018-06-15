"use strict";
define([
		"TokensCollection",
		"postal"
	], function(TokensCollection, postal){

	var R = new $Class({ name : "R", namespace : "Core" }, {
		$constructor : function(){
			this.content = {};
			this.load(this.getStaticResList());
		},
		load : function(list){
			var count = this.count(list);
			_.forEach(list, function(category, name){
				if (_.isFunction(this.loaders.list[name])){
					this.loaders.list[name].call(this, category)
				} else {
					console.warn("No loader for", name);
				}
			}.bind(this));
		},
		count : function(list){
			var count = 0;
			_.forEach(list, function(category, name){
				_.forEach(category, function(token, name){
					count++;
				});
			});

			return count;
		},
		loaders : {
			value : new TokensCollection({
				template : function(tokens){
					_.forEach(tokens, function(token, name){
						postal.set("res.templates." + name, token);
					});
				}
			})
		},
		getStaticResList : function(){
			var list = {};
			var templateNodes = document.querySelectorAll("template");
			if (templateNodes && templateNodes.length){
				list.template = {};
				_.forEach(templateNodes, function(templateNode){
					list.template[templateNode.id] = templateNode.innerHTML;
				});
			}

			return list;
		}
	});

	return R;

});