"use strict";
requirejs(["/require.config.js"], function(requireConfig){
	requirejs.config(requireConfig);
	requirejs(["JiveCore"], function(JiveCore){
		window.core = new JiveCore;
		window.core.load();
	});

});