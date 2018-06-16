"use strict";
define([
		"Trident/SOM/Node/Atlas"
	], function(Atlas){

	var TridentNode = new $Class({ name : "Node", namespace : "Trident.SOM" }, {
		$constructor : function(dom){
			var _this = this;

			this.atlas = new Atlas();
			this.state = {
				prevTagName : "",
				prevAttrsStamp : "",
				prevDomChildrenStamp : "",
				attributes : {},
				changedAttributes : {},
				selectorsCache : {},
				get domChildren(){
					return (_this.dom && _this.dom.children) ? _this.dom.children : {};
				},
				children : []
			};
			this.__content = null;
			this.dom = dom;
		},
		uuid : {
			get : function(){
				if (!this.__uuid) this.__uuid = $Class._.genRandString(16, "node-");
				return this.__uuid;
			},
		},
		attributes : {
			get : function(){
				return this.dom ? this.dom.attributes : null;
			}
		},
		tagName : {
			get : function(){
				return (this.dom && this.dom.tagName) ? this.dom.tagName.toLowerCase() : {};
			}
		},
		classList : {
			get : function(){
				return (this.dom && this.dom.classList) ? this.dom.classList : {};
			}
		},
		children : {
			get : function(){
				return this.state.children;
			}
		},
		parentNode : {
			get : function(){
				return (this.dom.parentNode && this.dom.parentNode.nodeType == 1 && this.dom.parentNode.som) ? this.dom.parentNode.som : null;
			}
		},
		parentNodeSubject : {
			get : function(){
				return this.parentNode ? this.parentNode.subject : null;
			}
		},
		dom : {
			set : function(dom){
				this.__dom = dom;
				dom.som = this;
				dom.setAttribute("data-trident-uuid", this.uuid);
				this.sync();
			},
			get : function(){
				return this.__dom;
			}
		},
		crateAttrsStamp : function(attrs){
			var result = [];
			_.forEach(attrs, function(attribute){
				result.push([attribute.name, attribute.value].join("="));
			});

			result = result.join("|");
			return result;
		},
		createDomChidrenStamp : function(children){
			var stamp = _.map(children, function(child){
				return ["(?=.*" + child.getAttribute("data-trident-uuid") + ")"];
			}).join("");

			return stamp;
		},
		formatAttributes : function(attributes){
			var fAttributes = {};
			var changedAttributes = this.state.changedAttributes;

			_.forEach(attributes, function(attribute){
				if (fAttributes[attribute.name] != attribute.value){

					try {
						fAttributes[attribute.name] = JSON.parse(attribute.value);
					} catch (err){
						fAttributes[attribute.name] = attribute.value;
					}

					changedAttributes[attribute.name] = fAttributes[attribute.name];
				}
				
			});

			this.state.fAttributes = fAttributes;
			this.state.changedAttributes = changedAttributes;
		},
		sync : function(){
			var dom = this.__dom;
			var attrsStamp = this.crateAttrsStamp(this.attributes);
			var domChildrenStamp = this.createDomChidrenStamp(this.state.domChildren);
			var isChildFirst = this.atlas.isChildFirst(this.tagName);
			var childNeedsUpdate = false;

			if (isChildFirst){
				childNeedsUpdate = !this.state.prevDomChildrenStamp.match(new RegExp(domChildrenStamp));

				if (childNeedsUpdate){
					this.state.prevDomChildrenStamp = domChildrenStamp;
					this.syncChildren();
				}

				if (this.tagName != this.state.prevTagName || !this.subject){
					this.syncTag();
				}

				if (this.subject && !this.state.prevAttrsStamp.match(new RegExp(attrsStamp))){
					this.state.prevAttrsStamp = attrsStamp;
					this.syncAttrs();
				}

				if (childNeedsUpdate){
					this.state.prevDomChildrenStamp = domChildrenStamp;
					this.syncChildren(true);
				}
			} else {
				if (this.tagName != this.state.prevTagName || !this.subject){
					this.syncTag();
				}

				if (this.subject && !this.state.prevAttrsStamp.match(new RegExp(attrsStamp))){
					this.state.prevAttrsStamp = attrsStamp;
					this.syncAttrs();
				}


				if (!this.state.prevDomChildrenStamp.match(new RegExp(domChildrenStamp))){
					this.state.prevDomChildrenStamp = domChildrenStamp;
					this.syncChildren();
				}
			}
		},
		syncTag : function(){
			var tagName = this.tagName;
			var attributes = this.attributes;
			this.formatAttributes(this.dom.attributes);

			this.subject = this.atlas.create(this, tagName, this.state.fAttributes, this.parentNode);
			this.state.prevTagName = tagName;
		},
		syncAttrs : function(){			
			var tagName = this.tagName;
			this.formatAttributes(this.dom.attributes);

			var changedAttributes = this.state.changedAttributes;

			this.atlas.setup(this, tagName, this.subject, changedAttributes, this.parentNode);
		},
		syncChildren : function(fullSync){
			var domChildren = this.state.domChildren;
			var children = this.children;
			var newChildren = [];

			_.forEach(domChildren, function(dom, index){
				var uuid = dom.getAttribute("data-trident-uuid");
				var som = _.filter(children, function(som){ 
					if (som.uuid == uuid){
						return true;
					}
				})[0];

				if (!som){
					newChildren.push(new TridentNode(dom));
				} else {
					newChildren.push(som);
					if (fullSync) som.sync();
				}

			});

			this.state.children = newChildren;
		},
		querySelector : function(selector, noCache, handler){
			var element = this.querySelectorAll(selector, noCache)[0] || null;
			if (element && typeof handler == "function"){
				handler(element);
			}

			return element;
		},
		querySelectorAll : function(selector, noCache, handler){
			if (typeof noCache == "function"){
				handler = noCache;
				noCache = false;
			}

			var nodesList = (noCache !== true && this.state.selectorsCache[selector]) ? this.state.selectorsCache[selector] : null;
			var domNodesList

			if (!nodesList){
				nodesList = [];
				domNodesList = this.dom.querySelectorAll(selector);

				_.forEach(domNodesList, function(domNode){
					var som = domNode.som;
					if (som){ 
						nodesList.push(som);
						if (typeof handler == "function"){
							handler(som);
						}
					}
				});
			} else {
				_.forEach(nodesList, function(){
					if (typeof handler == "function"){
						handler(som);
					}
				});
			}
		
			this.state.selectorsCache[selector] = nodesList;

			return nodesList;
		}
	});

	return TridentNode;

});