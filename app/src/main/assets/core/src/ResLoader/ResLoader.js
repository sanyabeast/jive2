"use strict";
define([
		"postal",
		"ResLoader/Loaders",
		"howler",
		"superagent",
	], function(postal, Loaders, Howler, superagent){

	var R = new $Class({ name : "R", namespace : "Core" }, {
		$constructor : function(){
			this.content = {};
		},
		loaders : {
			value : new Loaders()
		},
		load : function(){
			return new Promise(function(resolve, reject){
				superagent.get("resmap.json").then(function(response){
					var resMap = JSON.parse(response.text);
					this.$loadResmap(resMap, resolve, reject);
				}.bind(this)).catch(function(){
					resolve(null);
				}.bind(this))

			}.bind(this));
		},
		$loadResmap : function(resMap, resolve, reject){
			$postal.say("$resloader.loading.started");
			$postal.say("$resloader.loading.progress", {
				value : 0
			});

			var resCount = this.$countAssets(resMap);
			var loadedCount = 0;
			var result = {};

			_.forEach(resMap, function(assetMap, assetType){
				if (this.loaders[assetType]){
					this.loaders[assetType].load(assetMap, function(totalProgress, loadedAssetsCount, loadedAsset){
						loadedCount++;
						$postal.say("$resloader.loading.progress", {
							value : loadedCount / resCount
						});

						if (loadedCount >= resCount){
							resolve(result);
							$postal.say("$resloader.loading.finished");
						}

					}).then(function(data){
						result[assetType] = data;
					})
				} else {
					console.log("No loader for " + assetType);
				}
			}.bind(this));

		},
		$countAssets : function(resMap){
			var result = 0;
			_.forEach(resMap, function(assetMap){
				_.forEach(assetMap, function(asset){
					result++;
				});
			});

			return result;
		},
	});

	return R;

});