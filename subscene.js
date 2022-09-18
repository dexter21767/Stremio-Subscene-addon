const cinemeta = require('./lib/cinemeta');
const subscene = require("node-subscene-api")
const config = require('./config');
require('dotenv').config();

const NodeCache = require("node-cache");
const Cache = new NodeCache();
const count = 5;

async function getsubtitles(type, id, lang) {
    var meta = await cinemeta(type, id)
    var slug = meta.slug;
    var moviePath = `/subtitles/${slug}/`;
    console.log(moviePath);
    var cachID = id + '_' + lang
    var cached = Cache.get(cachID);
    if (cached) {
        console.log('cached main', cachID, cached);
        return cached
    } else {
        return subscene.getSubtitles(moviePath).then(subtitles => {
            //console.log(subtitles)
            const subs = [];
            if (subtitles[lang]) {
            subtitles = subtitles[lang];
                console.log(subtitles);
                for (let i = 0; i < (count || subtitles.length); i++) {
                    if (subtitles[i]) {
                        let name = slug + '_' + lang + '_' + i;
                        let path = subtitles[i].path
                        subs.push({
                            lang: lang, 
                            id: name,
                            url: `http://127.0.0.1:11470/subtitles.vtt?from=${config.local}${subtitles[i].path}.zip`
                        });
                    }
                }
            console.log('subs',subs);
            console.log("Cache keys", Cache.keys());
            //subs = subs.filter(Boolean);
            let cached = Cache.set(cachID, subs);
            console.log("cached", cached)
            return subs;
            }
        }).catch(err => console.error(err))
    }
}

async function getURL(path){
    return subscene.download(path,{zip:true}).then(file=>{
        //console.log(file)
        return file;
      }).catch(error=>{console.log(error)});
}

module.exports = { getsubtitles, getURL };
