"use strict";
var box;
var width = window.innerWidth / 10;
var height = window.innerHeight / 10;

for (var x = 0; x < 10; x++ ){
	for (var y = 0; y < 10; y++){
		box = document.createElement("div");
		box.classList.add("box");
		box.style.left = (x * width) + "px";
		box.style.top = (y * height) + "px";
		box.style.animationDuration = (Math.random() * 10) + "s";

		document.body.appendChild(box);
	}
}