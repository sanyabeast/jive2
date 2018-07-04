setTimeout(function(){
	requirejs.config(window.requireConfig);

	requirejs(["dollaclass", "lodash", "three", "threeOrbit", "vue", "vuex", "postal"], function($Class, _, THREE, OrbitControls, Vue, Vuex, postal){
		window.postal = postal;

		window.Vue = Vue;
		window.Vuex = Vuex;
		Vue.use(Vuex);

		window.$Class = $Class;
		THREE.OrbitControls = OrbitControls(THREE);
		window.THREE = THREE;

		requirejs(["ResLoader/ResLoader"], function(ResLoader){
			window.r = new ResLoader();
			window.r.load().then(function(resources){
				window.resources = resources;

				requirejs(["unicycle", "postal", "Trident/Trident"], function(Unicycle, postal, Trident){
					window.trident = new Trident();
					window.postal = postal;
					window.unicycle = new Unicycle();

					requirejs(["App"], function(App){
						window.app = new App();
						$postal.say("activity.inited", window.current);
					});
				});
			});			
		});
	});	
});