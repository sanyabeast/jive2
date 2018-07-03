setTimeout(function(){
	requirejs.config(window.requireConfig);

	requirejs(["dollaclass", "lodash", "three", "threeOrbit", "vue", "vuex"], function($Class, _, THREE, OrbitControls, Vue, Vuex){
		window.Vue = Vue;
		window.Vuex = Vuex;
		Vue.use(Vuex);

		window.$Class = $Class;
		THREE.OrbitControls = OrbitControls(THREE);
		window.THREE = THREE;

		window.templates = window.r.loadTemplates(document);
		window.vueComponents = window.r.loadVueComponents(document, Vue);

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