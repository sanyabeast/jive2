var directoryTree = require("directory-tree");
var _ = require("lodash");
var jsonfile = require("jsonfile");
var fs = require("fs");
var fsExtra = require("fs-extra");
var path = require("path");

class Resmap {
	constructor(){
		this.appsTree = directoryTree("./apps");
	}

	run(){
		_.forEach(this.appsTree.children, (appTree)=>{
			var resDirectory = _.filter(appTree.children, (token)=>{
				return (token.type == "directory" && token.name == "res");
			})[0];

			if (resDirectory){
				this.runForApp(resDirectory, appTree);
			}
		});
	}

	runForApp(resDirectory, appTree){
		var resmap = {};

		_.forEach(resDirectory.children, (dir)=>{
			resmap[dir.name] = this.runForAssetType(dir);
		});



		jsonfile.writeFileSync(path.resolve(appTree.path, "resmap.json"), resmap, {spaces: 2});

		return resmap;

	}

	runForAssetType(assetTypeDir, prefix){
		prefix = prefix || "";
		var result = {};

		_.forEach(assetTypeDir.children, (token)=>{
			if (token.type == "file"){
				result[prefix + token.name] = token.path;
			} else if (token.type == "dir"){
				result = _.merge(result, this.runForAssetType(token, token.name + "."))
			}
		});


		return result;
	}
}

new Resmap().run();
