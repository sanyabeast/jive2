"use strict";
define("App", function(){

	var App =  new $Class({ name : "App" }, {
		$constructor : function(){
			this.scene = trident.parse(document.querySelector("#test-scene").content.cloneNode(true).children[0]);
			console.log(this.scene);

			var renderer = this.scene.subject;
			var scene = this.scene.querySelector("scene").subject;
			var camera = this.scene.querySelector("camera").subject;

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

			document.body.appendChild(this.scene.subject.domElement);

			unicycle.addTask(function(){
				renderer.render(scene, camera);
				controls.update();
			});
		}
	});

	return App;

});