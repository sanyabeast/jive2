setTimeout(function(){

	window.templates = window.r.loadTemplates(document);

	requirejs.config(window.requireConfig);

	requirejs(["dollaclass", "lodash", "three", "threeOrbit"], function($Class, _, THREE, OrbitControls){
		window.$Class = $Class;
		THREE.OrbitControls = OrbitControls(THREE);
		window.THREE = THREE;

		requirejs(["unicycle", "postal", "Trident/Trident", "vue", "vuex"], function(Unicycle, postal, Trident, Vue, Vuex){
			window.Vue = Vue;
			window.Vuex = Vuex;
			Vue.use(Vuex);

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