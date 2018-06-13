setTimeout(function(){
	requirejs.config(window.requireConfig);
	requirejs(["App"], function(App){
		window.app = new App();
		postal.say("core.frames.inited", window.frame);
		console.log(postal);
	});
}, 0);