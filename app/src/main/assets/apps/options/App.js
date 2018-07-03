"use strict";
define([
		"unicycle", 
		"postal",
		], function(unicycle, postal){

	var Activity = function(){

		this.root = new Vue({
			el : "#app",
			data : {
				message : "КуКуЁпта!"
			}
		})
	};

	return Activity;

});