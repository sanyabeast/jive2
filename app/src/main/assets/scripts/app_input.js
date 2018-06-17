setTimeout(function(){
	requirejs.config(window.requireConfig);
	requirejs(["unicycle", "App"], function(Unicycle, App){
		window.unicycle = new Unicycle();
		window.app = new App();
		postal.say("core.frames.inited", window.frame);
	});
});