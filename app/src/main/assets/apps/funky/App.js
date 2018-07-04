"use strict";
define("App", [
		"tweener"
	], function(tweener){

	var App =  new $Class({ name : "App" }, {
		$constructor : function(){
			this.stage = trident.buildStage(resources.templates.test.dom);

			var renderer = this.stage.subject;
			var scene = this.stage.querySelector("scene").subject;
			var camera = this.stage.querySelector("camera").subject;

			
			document.body.appendChild(this.stage.subject.domElement);

			unicycle.addTask(function(){
				renderer.render(scene, camera);
			});

			trident.setupEventsHandling(this.stage);


			window.addEventListener("resize", function(){
				renderer.setSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
			});

			this.setupOrbitControls(camera, scene, renderer);

			resources.sound["Bouncer 001"].play();
		},
		setupOrbitControls : function(camera, scene, renderer){
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
			controls.target.set(0,0,-300);

			unicycle.addTask(function(){
				controls.update();
			});

		}
	});

	return App;

});