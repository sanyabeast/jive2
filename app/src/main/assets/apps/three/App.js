"use strict";
define("App", ["three"], function(THREE){

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

		    // Add the camera to the scene.
		    scene.add(camera);

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

		    // add to the scene
		    scene.add(pointLight);

		    // create the sphere's material


		    // Set up the sphere vars

		    // Create a new mesh with
		    // sphere geometry - we will cover
		    // the sphereMaterial next!

		    var boxes = [];
		    var count = 10;

		    for (var a = 0; a < count; a++){
		    	for (var b = 0; b < count; b++){
		    		var sphereMaterial = new THREE.MeshLambertMaterial({
			            color: Math.random() * 16000000
			        });

		    		var box = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 10), sphereMaterial);

		    		box.position.z = -300;
		    		box.position.x = a * 12 - 55;
		    		box.position.y = b * 12 - 55;
		    		box.speed = Math.sqrt((a + 1) * (b + 1));

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
		      		boxes[a].rotation.z+= 0.001 * boxes[a].speed;
		      		boxes[a].rotation.y+= 0.001 * boxes[a].speed;
		      		boxes[a].rotation.x+= 0.001 * boxes[a].speed;
		      }
		      // sphere.rotation.z += 0.001;
		      // Schedule the next frame.
		    }

		    // Schedule the first frame.
		    unicycle.addTask(update);
		}
	});

	return App;

});