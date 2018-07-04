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
				var totalCount = this.count(assetsList);
				var resultedAssets = Array.isArray(assetsList) ? [] : {};


				_.forEach(assetsList, function(asset, index){
					this.loadAsset(asset).then(function(loadedAsset){
						resultedAssets[index] = loadedAsset;
						loadedCount++;

						if (_.isFunction(onProgress)){
							onProgress(loadedCount / totalCount, loadedCount, loadedAsset);
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
		count : function(assetsList){
			var result = 0;

			if (Array.isArray(assetsList)){
				result = assetsList.length;
			} else {
				_.forEach(assetsList, function(){
					result++;
				});
			}

			return result;
		}
	});

	return Loader;
});