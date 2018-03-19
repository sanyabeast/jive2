"use strict";
postal.listen("android::bridge", function(data){
	if (typeof data == "object" && typeof data.channel == "string" && typeof data.topic == "string"){
		postal.publish({
			channel : data.channel,
			topic : data.topic,
			data : data.data
		});
	} else {
		console.warn("JIVE: unable to dispatch event");
	}
});

postal.listen("android::showToast", function(message){
	android.showToast(message);
});

postal.listen("android::finish", function(){
	android.finish();
});

postal.listen("android::exit", function(){
	android.exit();
});