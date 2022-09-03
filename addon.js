const { addonBuilder } = require("stremio-addon-sdk");

const findRemoveSync = require('find-remove')
const subscene = require("./subscene");


// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md
const manifest = require("./manifest");
const builder = new addonBuilder(manifest)




builder.defineSubtitlesHandler((args) => {
	console.log("addon.js subtitle:", args);
  if(args.id.match(/tt[0-9]*/i)){
    return Promise.resolve(subscene(args.type ,args.id))
	.then((subtitles) => ({  subtitles: subtitles}));
	}else {
	return Promise.resolve({ subtitles: [] });
  }
});

module.exports = builder.getInterface()