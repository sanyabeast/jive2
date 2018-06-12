"use strict";
define([
		"ToolChain",
		"postal",
		"superagent"
	], function(tools, postal, superagent){

	var Activity = new $Class({ name : "Activity", namespace : "Core" }, {
		$constructor : function(path, name){
			this.name = name || "index";
			this.path = path;
			this.escapedPath = "apps/" + path.replace(/\./g, "/");
		},
		make : function(){
			return new Promise(function(resolve, reject){
				if (this.url == null){
					var activityWrapper = tools.template("activity");
					var activityContent;

					console.log(activityWrapper);

					superagent.get(this.alias(this.escapedPath, this.name + ".xml")).then(function(response){
						var html = response.text;
						var dom = this.html2dom(html);
						activityWrapper.querySelector("content").appendChild(dom);
						var blobHTML = this.dom2html(activityWrapper);
						blobHTML = blobHTML.replace(/head_head/g, "head");
						blobHTML = blobHTML.replace(/body_body/g, "head");

						this.blob = new Blob([blobHTML], { type : "text/html" });
						this.url = URL.createObjectURL(this.blob);

						resolve(this.url);
					}.bind(this))
				} else {
					resolve(this.url);
				}
			}.bind(this));

			
		},
		html2dom : function(html){
			var parent = document.createElement("div");
			var child;
			parent.innerHTML = html;
			var frag = this.nodes2frag(parent.childNodes);
			parent.remove();
			return frag;
		},
		nodes2frag : function(node){
			var frag = new DocumentFragment();

			if (node instanceof window.Node){
				frag.appendChild(node);
			} else if (node instanceof window.NodeList){
				while (node.length > 0){
					frag.appendChild(node[0]);
				}
			}

			return frag;
		},
		dom2html : function(dom){
			console.log(dom);
			var parent = document.createElement("div");
			var frag = this.nodes2frag(dom);
			parent.appendChild(frag);
			var result = parent.innerHTML;
			parent.remove();
			return result;
		},
		blob : {
			value : null,
			writable : true,
		},
		url : {
			value : null,
			writable : true,
		},
		escapedPath : {
			value : null,
			writable : true
		},
		path : {
			value : null,
			writable : true
		},
		name : {
			value : null,
			writable : true
		},
		toBlob : function(){
			return ["apps", this.escapedPath, this.name + ".xml"].join("/");
		},
		toURL : function(){

		},
		alias : {
			value : function(path, name){
				return [path, name].join("/");
			},
			static : true
		}
	});

	window.Activity = Activity;

	return  Activity;

});