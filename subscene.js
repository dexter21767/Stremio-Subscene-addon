const tmdb = require('./tmdb');
const subscene = require('node-subscene-api');
const config = require('./config');
require('dotenv').config();
const languages = require('./languages.json');
const count = 10;
const NodeCache = require("node-cache");
const Cache = new NodeCache();
const filesCache = new NodeCache();
const MetaCache = new NodeCache();
const subsceneCache = new NodeCache();


async function subtitles(type, id, lang) {
    console.log(type, id, lang);
    let metaid = id.split(':')[0];
    var meta = MetaCache.get(metaid);
    if (!meta) {
        meta = await tmdb(type, metaid);
        if (meta) {
            MetaCache.set(metaid, meta);
        }
    }
    if(meta){
    console.log("meta",meta)
    if (type == "movie") {
        let moviePath = `/subtitles/${meta.slug}/`;
        console.log(moviePath);

        return getsubtitles(moviePath, id, lang)
    }
    else {
        let season = parseInt(id.split(':')[1]);
        season = ordinalInWord(season);
        let episode = id.split(':')[2];
        var moviePath = '/subtitles/' + meta.slug + '-' + season + '-season';
        let subtitles = await subscene.getSubtitles(moviePath).catch(error => { console.error(error) })
        console.log('subtitles', Object.keys(subtitles).length)
        if (!Object.keys(subtitles).length) {
            moviePath = '/subtitles/' + meta.slug;
        }
        if(meta.slug=='the-100'){
            moviePath = `/subtitles/the-100-the-hundred-${season}-season`;
        }
        console.log(moviePath);
        return await sleep(2000).then(() => { return getsubtitles(moviePath, id.split(":")[0] + '_season_' + id.split(":")[1], lang, episode) })
        function sleep(ms) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }
        }
    }
}


async function getsubtitles(moviePath, id, lang, episode) {
    console.log(moviePath, id, lang, episode)
    const cachID = `${id}_${lang}`;
    let cached = Cache.get(cachID);
    if (cached) {
        console.log('cached main', cachID, cached);
        return cached
    } else {
        let subs = [];
        console.log(moviePath)

        var subtitles = subsceneCache.get(moviePath);
        if (!subtitles) {
            subtitles = await subscene.getSubtitles(moviePath).catch(error => { console.error(error) })
            if (subtitles) {
                subsceneCache.set(moviePath, subtitles);
            }
        }
        console.log('subtitles', Object.keys(subtitles).length)
        console.log('subtitles', moviePath)
        if (subtitles[lang]) {
            subtitles = subtitles[lang];
            //console.log('subtitles',subtitles)
            let sub;
            if (episode) {
                let episodeText = (episode.length == 1) ? ('0' + episode) : eposide;
                episodeText = 'E' + episodeText
                console.log('episode', episodeText)
                sub = filtered(subtitles, 'title', episodeText)
                console.log('sub', sub)

                episodeText = episode.length == 1 ? '0' + episode : eposide;
                sub = sub.concat(filtered(subtitles, 'title', episodeText))
                sub = [...new Set(sub)];
                console.log('sub', sub)

            }
            if (sub) {
                subtitles = sub;
            }
            for (let i = 0; i < (count || subtitles.length); i++) {
                let value = subtitles[i];
                if (value) {
                    let path = value.path
                    if (episode) {
                        url = `http://127.0.0.1:11470/subtitles.vtt?from=${config.local}${path}.zip`
                    } else {
                        url = `http://127.0.0.1:11470/subtitles.vtt?from=${config.local}${path}.zip`
                    }
                    subs.push({
                        lang: languages[lang].iso || languages[lang].id,
                        id: `${cachID}_${i}`,
                        url: url
                    });
                }
            }

            console.log('subs', subs);
            console.log("Cache keys", Cache.keys());
            //subs = subs.filter(Boolean);
            let cached = Cache.set(cachID, subs);
            console.log("cached", cached)
            return subs;
        }else{
            return
        }
    }
}

async function proxyStream(path, episode) {
    let cachID = episode ? path + '_' + episode : path;
    let cached = filesCache.get(cachID);
    if (cached) {
        console.log('File already cached', cachID);
        return cached
    } else {
        return subscene.download(path, { zip: true }).then(file => {
            console.log('file', file)
            let cached = filesCache.set(cachID, file);
            console.log("Caching File", cached)
            return file;
        }).catch(error => { console.log(error) });
    }
}


function filtered(list, key, value) {
    var filtered = [], i = list.length;
    var reg = new RegExp(value.toLowerCase(), 'gi');
    while (i--) {
        if (reg.test(list[i][key].toLowerCase())) {
            filtered.push(list[i]);
        }
    }
    return filtered;
};

function ordinalInWord(cardinal) {
    const ordinals = ["zeroth", "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth", "Thirteenth", "Fourteenth", "Fifteenth", "Sixteenth", "Seventeenth", "Eighteenth", "Nineteenth", "Twentieth"]

    var tens = {
        20: 'twenty',
        30: 'thirty',
        40: 'forty',
        50: 'Fifty',
        60: 'Sixty',
        70: 'Seventy',
        80: 'Eighty',
        90: 'Ninety'

    };
    var ordinalTens = {
        30: 'thirtieth',
        40: 'fortieth',
        50: 'fiftieth',
        60: 'Sixtieth',
        70: 'Seventieth',
        80: 'Eightieth',
        90: 'Ninetieth'
    };

    if (cardinal <= 20) {
        return ordinals[cardinal];
    }

    if (cardinal % 10 === 0) {
        return ordinalTens[cardinal];
    }

    return tens[cardinal - (cardinal % 10)] + ordinals[cardinal % 10];
}


module.exports = { subtitles, proxyStream };
