"use strict";
define("App", ["three", "threeOrbit", "tweener"], function(THREE, OrbitControls, tweener){

	window.tweener = tweener;


	THREE.OrbitControls = OrbitControls(THREE);

	var App =  new $Class({ name : "App" }, {
		$constructor : function(){
			// Set the scene size.

			var DPR = window.devicePixelRatio;

		    var WIDTH = window.innerWidth * DPR;
		    var HEIGHT = window.innerHeight * DPR;

		    // Set some camera attributes.
		    var VIEW_ANGLE = 45;
		    var ASPECT = WIDTH / HEIGHT;
		    var NEAR = 0.1;
		    var FAR = 10000;

		    // Get the DOM element to attach to
		    var container =
		        document.querySelector('#container');

		    // Create a WebGL renderer, camera
		    // and a scene
		    var renderer = new THREE.WebGLRenderer();
		    var camera =
		        new THREE.PerspectiveCamera(
		            VIEW_ANGLE,
		            ASPECT,
		            NEAR,
		            FAR
		        );

		    var scene = new THREE.Scene();

		    var controls = new THREE.OrbitControls( camera , renderer.domElement);
		    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
			controls.dampingFactor = 0.25;

			controls.screenSpacePanning = false;

			controls.minDistance = 1;
			controls.maxDistance = 500

			window.controls = controls;
			window.camera = camera;

			controls.maxPolarAngle = Math.PI;
			controls.rotateSpeed = 0.08;
			controls.target.set(0,0,-300)

		    // Add the camera to the scene.
		    scene.add(camera);

		    camera.position.x=0.0206593961445023;
			camera.position.y=0.0853731858682841;
			camera.position.z=0.9961348344906146;

		    // Start the renderer.
		    renderer.setSize(WIDTH, HEIGHT);
		    window.addEventListener("resize", function(){
		    	renderer.setSize(window.innerWidth * DPR, window.innerHeight * DPR);
		    });

		    // Attach the renderer-supplied
		    // DOM element.
		    document.body.appendChild(renderer.domElement);
		    renderer.domElement.style.width = "100%";
		    renderer.domElement.style.height = "100%";

		    // create a point light
		    var pointLight =
		      	new THREE.PointLight(0xFFFFFF);

		    // set its position
		    pointLight.position.x = 10;
		    pointLight.position.y = 50;
		    pointLight.position.z = 130;

		    tweener.to(pointLight.position, 1, {
		    	y : 100,
		    	x : 50,
		    	repeat : -1,
		    	yoyo : true
		    });

		    // add to the scene
		    scene.add(pointLight);

		    // create the sphere's material


		    // Set up the sphere vars

		    // Create a new mesh with
		    // sphere geometry - we will cover
		    // the sphereMaterial next!

		    var boxes = [];
		    var count = 20;

		    var colors = [
		    	0xf44336,
		    	0xe91e63,
		    	0x9c27b0,
		    	0x3f51b5,
		    	0x2196f3,
		    	0x00bcd4,
		    	0x009688,
		    	0x4caf50,
		    	0xcddc39,
		    	0xffeb3b,
		    	0xff9800,
		    	0xff5722
		    ];

		    for (var a = 0; a < count; a++){
		    	for (var b = 0; b < count; b++){
		    		var sphereMaterial = new THREE.MeshLambertMaterial({
			            color: colors[Math.floor(Math.random() * colors.length)]
			        });

		    		var box = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), sphereMaterial);

		    		box.position.z = -300;
		    		box.position.x = a * 6 - 55;
		    		box.position.y = b * 6 - 55;

		    		if (a % 2 == 0){
		    			setTimeout(function(){
			    			tweener.to(this.position, 1, {
				    			z : -280,
				    			repeat : -1,
				    			yoyo : true,
				    			ease : "easeInOutQuad"
				    		});
			    		}.bind(box), b * 100);
		    		} else {
		    			setTimeout(function(){
			    			tweener.to(this.position, 1, {
				    			z : -280,
				    			repeat : -1,
				    			yoyo : true,
				    			ease : "easeInOutQuad"
				    		});
			    		}.bind(box), a * 100);
		    		}


		    		scene.add(box);
		    		boxes.push(box);
		    	}
		    }

		    // Move the Sphere back in Z so we
		    // can see it.
		    

		    // Finally, add the sphere to the scene.

		    function update () {
		      renderer.render(scene, camera);
		      for (var a =0, l = boxes.length; a < l; a++){
		      		boxes[a].rotation.z+= 0.005;
		      		boxes[a].rotation.y+= 0.005;
		      		boxes[a].rotation.x+= 0.005;
		      }

		      controls.update();
		      // sphere.rotation.z += 0.001;
		      // Schedule the next frame.
		    }

		    // Schedule the first frame.
		    unicycle.addTask(update);
		}
	});

	return App;

});