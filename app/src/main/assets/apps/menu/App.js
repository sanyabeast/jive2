"use strict";
define([
		"unicycle", 
		"postal",
		], function(unicycle, postal){

	var Activity = function(){
		Vue.component("root", {
			template : templates.root.html,
			props : ["message"]
		});

		new Vue({
			el : "#app",
			data : {
				message : "sfsdf"
			}
		})
	};

	return Activity;

});