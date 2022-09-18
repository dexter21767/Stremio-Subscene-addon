const cinemeta = require('./lib/cinemeta');
const subscene = require('node-subscene-api')
const config = require('./config');
require('dotenv').config();
var isoConv = require('iso-language-converter');

const NodeCache = require("node-cache");
const Cache = new NodeCache();

async function getsubtitles(type, id, lang) {
    const meta = await cinemeta(type, id)
    const slug = meta.slug;
    const moviePath = `/subtitles/${slug}/`;
    // console.log(moviePath);
    const cachID = id + '_' + lang
    const cached = Cache.get(cachID);

    if (cached) {
        console.log('cached main', cachID, cached);
        return cached
    } else {
        let subs = [];
        const subtitles = await subscene.getSubtitles(moviePath)
        if (subtitles[lang]) {
            const subISO6392 = isoConv(lang.charAt(0).toUpperCase() + lang.slice(1),{from:"label",to:2})
            subtitles[lang].forEach(function (value, i) {
                if (value) {
                    let path = value.path
                    let id = path.split("/")[4]
                    subs.push({
                        lang: subISO6392, 
                        id,
                        url: `http://127.0.0.1:11470/subtitles.vtt?from=${config.local}${path}.zip`
                    });
                }
            });

            console.log('subs',subs);
            console.log("Cache keys", Cache.keys());
            //subs = subs.filter(Boolean);
            let cached = Cache.set(cachID, subs);
            console.log("cached", cached)
            return subs;
        }
    }
}

async function getURL(path){
    return subscene.download(path,{zip:true}).then(file=>{
        //console.log(file)
        return file;
      }).catch(error=>{console.log(error)});
}

module.exports = { getsubtitles, getURL };
