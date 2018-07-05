"use strict";
define("App", [
		"tweener",
		"matter",
		"Trident/Tools/PolyShader",
		"bezierEasing"
	], function(tweener, matter, PolyShader, BezierEasing){

	console.log(BezierEasing);

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

			var bezier = BezierEasing(0.85, 0.04, 1, 1);

			this.stage.select(".racket", function(n){
				tweener.fromTo(n.subject.rotation, 5, {
					z : 0,
				}, {
					z : 1 * Math.PI,
					repeat : -1,
					yoyo : true,
					ease : function(t){ return bezier(t) }
				})
			});	

			this.stage.select(".ball", function(n){
				tweener.fromTo(n.subject.position, 1.2, {
					x : -70,
				}, {
					x : 70,
					repeat : -1,
					yoyo : true,
					ease : "easeInOutBack"
				})
			});	

			this.stage.traverse(function(node){
				// node.addEventListener("pointerdown", function(data){
				// 	tweener.to(node.subject.scale, 0.2, {
				// 		x : 2,
				// 		y : 2,
				// 		z : 2
				// 	});
				// });

				// node.addEventListener("pointerup", function(data){
				// 	tweener.to(node.subject.scale, 0.2, {
				// 		x : 1,
				// 		y : 1,
				// 		z : 1
				// 	});

				// });

				node.addEventListener("pointerdrag", function(delta){
					this.select("matter matter-body", function(node){
						var body = node.subject;
						if (body.isStatic){
							return;
						}
						delta.x = delta.x * 100;
						delta.y = delta.y * 100;
						matter.Body.setPosition(body, {
							x : body.position.x + delta.x,
							y : body.position.y + delta.y,
						});
						matter.Body.setVelocity(body, delta);
					})
				}.bind(node));
			});

			this.setupOrbitControls(camera, scene, renderer);
			this.setupCommonUniforms();

			resources.sound["Bouncer 001"].play();
		},
		setupOrbitControls : function(camera, scene, renderer){
			// return;
			var controls = new trident.THREE.OrbitControls(camera, renderer.domElement);
			controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
			controls.dampingFactor = 0.25;

			controls.screenSpacePanning = false;

			controls.minDistance = 1;
			controls.maxDistance = 1000

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

		},
		setupCommonUniforms : function(){
			unicycle.addTask(function(){
				PolyShader.common.time+=0.01;
			});
		}
	});

	return App;

});