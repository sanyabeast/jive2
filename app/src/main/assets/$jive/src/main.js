"use strict";
requirejs(["require.config.js"], function(requireConfig){
	requirejs.config(requireConfig);
	requirejs(["JiveCore", "lodash"], function(JiveCore, _){
		window.core = new JiveCore;
		window.core.load();
	});

});