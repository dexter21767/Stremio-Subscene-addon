const cinemeta = require('./lib/cinemeta');
const subscene = require('node-subscene-api')
const config = require('./config');
require('dotenv').config();
const languages = require('./languages.json');
const count = 5;
const NodeCache = require("node-cache");
const Cache = new NodeCache();
const filesCache = new NodeCache();

async function getsubtitles(type, id, lang) {
    const meta = await cinemeta(type, id)
    const slug = meta.slug;
    const moviePath = `/subtitles/${slug}/`;
    console.log(moviePath);
    const cachID = `${id}_${lang}`;
    let cached = Cache.get(cachID);

    if (cached) {
        console.log('cached main', cachID, cached);
        return cached
    } else {
        let subs = [];
        let subtitles = await subscene.getSubtitles(moviePath).catch(error=>{console.error(error)})
        if (subtitles[lang]) {
            subtitles = subtitles[lang];
            for(let i = 0;  i < (count || subtitles.length) ;i++){
                let value = subtitles[i];
                if (value) {
                    let path = value.path
                    let id = path.split("/")[4]
                    subs.push({
                        lang: languages[lang].iso||languages[lang].id, 
                        id: `${cachID}_${i}`,
                        url: `http://127.0.0.1:11470/subtitles.vtt?from=${config.local}${path}.zip`
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
    }
}

async function getURL(path){
    
    let cached = filesCache.get(path);
    if (cached) {
        console.log('File already cached');
        return cached
    } else {
    return subscene.download(path,{zip:true}).then(file=>{
        //console.log(file)
        let cached = filesCache.set(path, file);
        console.log("Caching File", cached)
        return file;
      }).catch(error=>{console.log(error)});
    }
}

module.exports = { getsubtitles, getURL };
