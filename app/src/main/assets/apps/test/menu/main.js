"use strict";
console.log(2);
window.addEventListener("jive.ready", function(){
	var box;
	var count = 6;
	var width = window.innerWidth / count;
	var height = window.innerHeight / count;

	for (var x = 0; x < count; x++ ){
		for (var y = 0; y < count; y++){
			box = document.createElement("div");
			box.classList.add("box");
			box.style.backgroundColor = ["hsl(", Math.random() * 360, ", 100%, 60%)"].join("");
			box.style.left = (x * width) + "px";
			box.style.top = (y * height) + "px";
			box.style.animationDuration = (Math.random() * 2 + 1) + "s";

			document.body.appendChild(box);
		}
	}

	// console.log(android.gsIsSignedIn());
	// setTimeout(function(){
	// 	android.gsShowAchievements();
	// }, 2000);

	// postal.listen("google.services::connected", function(data){
	// 	console.log("kek", JSON.stringify(data));
	// });
	//android.gsStartSignInIntent();
});

// setInterval(function(){
// 	console.log(window.android);
// }, 1000);