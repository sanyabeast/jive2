"use strict";
define("App", [
		"tweener"
	], function(tweener){

	var App =  new $Class({ name : "App" }, {
		$constructor : function(){
			this.stage = trident.buildStage(document.querySelector("#test-scene").content.cloneNode(true).children[0]);

			var renderer = this.stage.subject;
			var scene = this.stage.querySelector("scene").subject;
			var camera = this.stage.querySelector("camera").subject;

			var controls = new trident.THREE.OrbitControls(camera, renderer.domElement);
			controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
			controls.dampingFactor = 0.25;

			controls.screenSpacePanning = false;

			controls.minDistance = 1;
			controls.maxDistance = 500

			window.controls = controls;
			window.camera = camera;
			window.scene = scene;
			window.renderer = renderer;

			controls.maxPolarAngle = Math.PI;
			controls.rotateSpeed = 0.08;
			controls.target.set(0,0,-300)

			this.stage.querySelectorAll("light[type=\"point\"]", function(node){
				tweener.to(node.subject.position, 5, {
					z : -100,
					repeat : -1,
					ease : "easeInOutQuad",
					yoyo : true
				});
			})

			this.stage.querySelectorAll("light[type=\"directional\"]", function(node){
				tweener.to(node.subject.position, 2, {
					x : -100,
					y : -100,
					repeat : -1,
					ease : "easeInOutQuad",
					yoyo : true
				});
			});

			this.stage.querySelectorAll(".test-sprites", function(node){
				tweener.to(node.subject.rotation, 3, {
					z : Math.PI * 2,
					x : Math.PI * 2,
					repeat : -1,
				});
			});

			document.body.appendChild(this.stage.subject.domElement);

			unicycle.addTask(function(){
				renderer.render(scene, camera);
				controls.update();
			});

			trident.setupEventsHandling(this.stage);

			this.stage.traverse(function(node){
				node.addEventListener("pointerover", function(data){
					tweener.to(node.subject.scale, 0.2, {
						x : 2,
						y : 2,
						z : 2
					});
				});

				node.addEventListener("pointerout", function(data){
					tweener.to(node.subject.scale, 0.2, {
						x : 1,
						y : 1,
						z : 1
					});

				});
			});

			window.addEventListener("resize", function(){
				renderer.setSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
			});
		}
	});

	return App;

});