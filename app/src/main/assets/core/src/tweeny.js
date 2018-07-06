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
			this.tick = this.tick.bind(this);
		},
		tasks : {
			value : {},
		},
		presets : {
			value : {}
		},
		now : {
			get : function(){ return +new Date(); }
		},
		addPreset : function(name, fromValue, toValue, duration, easing){
			this.presets[name] = {
				fromValue : fromValue,
				toValue : toValue,
				duration : duration,
				easing : easing
			};
		},
		runPreset : function(name, id, callback, fromValue, toValue, duration, easing){
			var preset = this.presets[name];

			fromValue 	= typeof fromValue 	== "number" 	? fromValue : preset.fromValue;
			toValue 	= typeof toValue 	== "number" 	? toValue 	: preset.toValue;
			duration 	= typeof duration 	== "number" 	? duration 	: preset.duration;
			easing      = typeof easing		== "function"	? easing    : preset.easing;

			return this.run(id, fromValue, toValue, duration, callback, easing);
		},
		tick : function(){
			var task;
			var callback;
			var easing;
			var progress;
			var fromValue;
			var toValue;
			var currentValue;
			var state = "progress";

			for (var k in this.tasks){
				task = this.tasks[k];

				fromValue = task.fromValue;
				toValue = task.toValue;
				callback = task.callback;
				easing = task.easing;
				progress = (this.now - task.start) / (task.end - task.start);
				progress = easing ? easing(progress) : progress;
				currentValue = fromValue + ( (toValue - fromValue) * progress );

				if (this.now >=  task.end){
					state = "complete";
					task.complete();
					this.counter--;
					delete this.tasks[k];
				}

				task.callback(currentValue, state);
			}
		},
		run : function(id, fromValue, toValue, duration, callback, easing){
			return new Promise(function(resolve, reject){
				id = id || (this.counter++).toString();
				duration = duration * 1000;

				this.tasks[id] = {
					fromValue : fromValue,
					toValue : toValue,
					start : this.now,
					end : this.now + duration,
					easing : easing || function(){},
					callback : callback || function(){},
					complete : resolve
				};
			}.bind(this));
		}
	});

	return new Tweeny();

});