"use strict";
window.addEventListener("jive.ready", function(){
	var box;
	var width = window.innerWidth / 10;
	var height = window.innerHeight / 10;

	for (var x = 0; x < 10; x++ ){
		for (var y = 0; y < 10; y++){
			box = document.createElement("div");
			box.classList.add("box");
			box.style.backgroundColor = ["hsl(", Math.random() * 360, ", 100%, 60%)"].join("");
			box.style.left = (x * width) + "px";
			box.style.top = (y * height) + "px";
			box.style.animationDuration = (Math.random() * 2 + 1) + "s";

			document.body.appendChild(box);
		}
	}

	console.log(android.gsIsSignedIn());
	setTimeout(function(){
		android.gsShowAchievements();
	}, 2000);

	postal.listen("google.services::connected", function(data){
		console.log("kek", JSON.stringify(data));
	});
	//android.gsStartSignInIntent();
});

// setInterval(function(){
// 	console.log(window.android);
// }, 1000);
