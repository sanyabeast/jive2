"use strict";
define([
		"three",
		"Trident/SOM",
		"Trident/Tools/PolyShader"
	], function(THREE, SOM, PolyShader){

	var Trident = new $Class({ name : "Trident", namespace : "Trident" }, {
		SOM : { value : SOM, static : true },
		PolyShader : PolyShader,
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
			var lastEventType = "";
			var pointerDelta = new THREE.Vector2(0, 0);

			stage.traverse(function(node, parent){
				node.interaction = node.interaction || {};
			});

			renderer.domElement.addEventListener("mousemove", function(event){
				lastEventType = "move";
				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
				noInteraction = false;
			});

			renderer.domElement.addEventListener("mouseover", function(event){
				lastEventType = "over";
				noInteraction = false;
				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			});

			renderer.domElement.addEventListener("mouseout", function(event){
				lastEventType = "out";
				noInteraction = true;
			});

			renderer.domElement.addEventListener("touchstart", function(event){	
				lastEventType = "down";
				noInteraction = false;
				mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.touches[0].clientY / window.innerHeight ) * 2 + 1;
			});

			renderer.domElement.addEventListener("touchend", function(event){
				lastEventType = "up";
				noInteraction = true;
			});

			renderer.domElement.addEventListener("touchmove", function(event){
				lastEventType = "move";
				mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.touches[0].clientY / window.innerHeight ) * 2 + 1;
				noInteraction = false;
			});


			renderer.domElement.addEventListener("mousedown", function(event){
				lastEventType = "down";
				noInteraction = false;
			});

			renderer.domElement.addEventListener("mouseup", function(event){
				lastEventType = "up";
				noInteraction = false;
			});

			unicycle.addTask(function(delta){
				var a = 0;
				var throttled = (lastEventType == "move") && (+new Date() - prevTime < throttle || (prevMouse.x == mouse.x && prevMouse.y == mouse.y));

				if (noInteraction || throttled){
					return;
				}

				pointerDelta.x = mouse.x - prevMouse.x;
				pointerDelta.y = mouse.y - prevMouse.y;

				prevMouse.x = mouse.x;
				prevMouse.y = mouse.y;

				prevTime = +new Date();
				raycaster.setFromCamera( mouse, camera );

				var intersects = [];
				var target;
				var targetUUID;
				var intersect;


				stage.traverse(function(node){
					if (!node.subject.children){
						return false;
					}

					target = raycaster.intersectObjects( node.subject.children )[0];

					if (target){
						return true;
					}

				});

				if (target){
					target = target.object;
					target = target.som;
				}


				if (target){
					targetUUID = target.uuid;

					if (lastEventType == "move" && target.interaction.hovered !== true){
						target.interaction.hovered = true;
						target.dispatchEvent("pointerover", target);
					} else if (lastEventType == "down"){
						if (target.interaction.captured !== true){
							target.interaction.hovered = target.interaction.captured = true;
							target.dispatchEvent("pointerdown", target);
							noInteraction = true;
						}
					} else if (lastEventType == "up"){
						if (target.interaction.captured === true){
							target.interaction.captured = false;
							target.dispatchEvent("pointerup", target);
						}
					} else if (lastEventType == "move" && target.interaction.captured){
						target.dispatchEvent("pointerdrag", pointerDelta);
						// console.log(pointerDelta);
					}

					
				}

				stage.traverse(function(node){
					if (node.uuid != targetUUID){
						if (node.interaction.hovered && lastEventType == "over"){
							node.interaction.hovered = false;
							node.dispatchEvent("pointerout", node);
						} else if (node.interaction.captured && lastEventType == "up"){
							node.interaction.captured = node.interaction.hovered = false;
							node.dispatchEvent("pointerup", node);
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