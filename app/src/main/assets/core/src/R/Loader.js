"use strict";
define(function(){

	var Loader = new $Class({ name : "Loader", namespace : "Core.R" }, {
		$constructor : function(loader){
			this.loader = loader;
		},
		loadAsset : function(asset){
			return new Promise(function(resolve, reject){
				this.loader(asset, resolve, reject);
			}.bind(this));
		},
		load : function(assetsList, onProgress, onComplete, onError){
			return new Promise(function(resolve, reject){
				var loadedCount = 0;
				var totalCount = assetsList.length;
				var resultedAssets = Array.isArray(assetsList) ? [] : {};

				_.forEach(assetsList, function(asset, index){
					this.loadAsset(asset).then(function(loadedAsset){
						resultedAssets[index] = loadedAsset;
						loadedCount++;

						if (_.isFunction(onProgress)){
							onProgress(loadedCount / totalCount, loadedAsset);
						}

						if (loadedCount >= totalCount){
							if (_.isFunction(onComplete)){
								onComplete(resultedAssets);								
							}

							resolve(resultedAssets);
						}
						
					}).catch(function(err){
						if (_.isFunction(onError)){
							onError(err);
						}
					});
				}.bind(this));
			}.bind(this));
		},
	});

	return Loader;
});