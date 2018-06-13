"use strict";
define([
		"unicycle", 
		"postal",
		], function(unicycle, postal){

	var Activity = function(){

		var box;
		var count = 10;
		var width = window.innerWidth / count;
		var height = window.innerHeight / count;

		// var kek = 0;

		// setInterval(function(){
		// 	console.log(++kek);
		// }, 1000);

		for (var x = 0; x < count; x++ ){
			for (var y = 0; y < count; y++){
				box = document.createElement("div");
				box.classList.add("box");
				box.style.backgroundColor = ["hsl(", Math.random() * 360, ", 100%, 60%)"].join("");
				box.style.left = (x * width) + "px";
				box.style.top = (y * height) + "px";
				box.style.animationDuration = (Math.random() * 8 + 2) + "s";

				document.body.appendChild(box);
			}
		}
	};

	return Activity;

});