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


postal.listen("android::button.pressed", function(data){
	postal.say("button::pressed", {
		keycode : data.mKeyCode
	});
});

postal.listen("button::pressed", function(data){
	switch(data.keycode){
		case 4:
			android.exit();
		break;
		case 24:
			android.showToast("privet");
		break;
		case 25:
			android.showToast(new Date().toString());
		break;
	}
});