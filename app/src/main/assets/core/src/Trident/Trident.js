"use strict";
define([
		"three",
		"Trident/SOM",
	], function(THREE, SOM){

	var Trident = new $Class({ name : "Trident", namespace : "Trident" }, {
		SOM : { value : SOM, static : true },
		$constructor : function(globalContext){
			this.som = new SOM();
			this.globalContext = globalContext;
			// console.log(THREE);
		},
		setGlobalContext : function(globalContext){
			this.som.setGlobalContext(globalContext);
		},
		buildStage : function(template, data){
			return this.som.make(template, data);
		},
		setupEventsHandling : function(stage, throttle){
			var throttle = throttle || (1000/60);
			var prevTime = +new Date();
			var noInteraction = true;

			var camera = stage.selectFirst("camera", true).subject;
			var renderer = stage.tagName == "renderer" ? stage.subject : stage.selectFirst("renderer", true).subject;
			var raycaster = new THREE.Raycaster();
			var mouse = new THREE.Vector2();
			var prevMouse = new THREE.Vector2();

			stage.traverse(function(node, parent){
				node.interaction = node.interaction || {};
			});

			renderer.domElement.addEventListener("mousemove", function(event){
				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			});

			renderer.domElement.addEventListener("mouseover", function(event){
				noInteraction = false;
				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			});

			renderer.domElement.addEventListener("mouseout", function(event){
				noInteraction = true;
			});

			renderer.domElement.addEventListener("touchstart", function(event){	
				noInteraction = false;
				mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.touches[0].clientY / window.innerHeight ) * 2 + 1;
			});

			renderer.domElement.addEventListener("touchend", function(event){
				noInteraction = true;
			});

			unicycle.addTask(function(delta){
				if (noInteraction || +new Date() - prevTime < throttle || (prevMouse.x == mouse.x && prevMouse.y == mouse.y)){
					return;
				}

				prevMouse.x = mouse.x;
				prevMouse.y = mouse.y;

				prevTime = +new Date();
				raycaster.setFromCamera( mouse, camera );

				var intersects = [];
				var target;
				var targetUUID;

				stage.traverse(function(node){
					if (!node.subject.children){
						return;
					}

					intersects = intersects.concat(raycaster.intersectObjects( node.subject.children ));
				});

				target = intersects[0] ? intersects[0].object.som : null;

				if (target){
					targetUUID = target.uuid;

					if (target.interaction.hovered !== true){
						target.interaction.hovered = true;
						target.dispatchEvent("pointerover", target);
					}
				}

				stage.traverse(function(node){
					if (node.uuid != targetUUID){
						if (node.interaction.hovered){
							node.interaction.hovered = false;
							node.dispatchEvent("pointerout", node);
						}
					}
				});

			});	
		},
		THREE : {
			get : function(){ return THREE; }
		}
	});

	return Trident;

});