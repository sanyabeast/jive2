"use strict";
define(function(){

	var $tweeny;

	var Tweeny = new $Class({
		name : "Tweeny",
		namespace : "Core"
	}, {
		$constructor : function(){
			this.counter = 0;
			this.run = this.run.bind(this);
		},
		tasks : {
			value : {},
			writable : true
		},
		now : {
			get : function(){ return +new Date(); }
		},
		tick : function(){
			var task;
			var callback;
			var easing;
			var progress;

			for (var k in this.tasks){
				task = this.tasks[k];
				callback = task.callback;
				easing = task.easing;
				progress = (task.end - this.now) / (task.end - task.start);

				task.callback(task);
			}
		},
		run : function(fromValue, toValue, duration, callback, easing){
			var id = (this.counter++).toString();
			duration = duration * 1000;

			this.tasks[id] = {
				fromValue : fromValue,
				toValue : toValue,
				start : this.now,
				end : this.now + duration,
				easing : easing || function(){},
				callback : callback || function(){}
			};

			return this;
		}
	});

	return new Tweeny();

});