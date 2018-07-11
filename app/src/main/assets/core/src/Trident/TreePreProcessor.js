"use strict";
define(function(){

	var TreePreProcessor = new $Class({
		name : "TreePreProcessor",
		namespace : "Core.Trident"
	}, {
		directives : {
			value : {
				repeat : function(value, node, parent, data, item, index){
					var list = this.getValue.apply(this, arguments);
					var frag = new DocumentFragment();

					node.setAttribute("trident:repeat", "$processed");

					_.forEach(list, function(item, index){
						var newNode = node.cloneNode(true);
						this.process(newNode, data, item, index);
						frag.addChild(newNode);
					}.bind(this));

					node.replaceWith(frag);
				}
			}
		},
		getValue : function(token, node, parent, data, item, index){
			try {
				return eval(token);
			} catch (err){
				console.warn("Trident, TreePreProcessor: invalid evaluable token " + token);
				return null;
			}
		},
		process : function(template, $data, $item, $index){
			template.traverse(function(child, parent){
				_.forEach(child.attributes, function(attr, index){
					var directive;
					var data = $data;
					var item = $item;
					var index = $index;
					var token;

					if (attr.value.indexOf("{") == 0 && attr.value.lastIndexOf("}") == attr.value.length - 1){
						token = attr.value.substring(1, attr.value.length - 1);
						attr.value = this.getValue(token, child, parent, data, item, index);
					}

					if (attr.name.indexOf("trident:") == 0){
						directive = attr.name.replace("trident:", "");

						if (attr.value == "$processed"){
							return;
						}

						if (this.directives[directive]){
							this.directives[directive].call(this, attr.value, child, parent, data, item);
						} else {
							console.warn("Trident, TreePreProcessor: directive does not exist " + directive);
						}
					}
				}.bind(this));
			}.bind(this));

			return template;
		}
	});

	return TreePreProcessor;

});