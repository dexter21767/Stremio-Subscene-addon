const cinemeta = require('./lib/cinemeta');
const subscene = require("node-subscene-api")
const fs = require('fs');
const path = require('path');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
const directory = 'data';

const NodeCache = require("node-cache");
const Cache = new NodeCache();

const count = 5;

async function getsubtitles(type, id, lang) {
    const promises = [];
    var meta = await cinemeta(type, id)
    var slug = meta.slug;
    var moviePath = `/subtitles/${slug}/${lang}`;
    console.log(moviePath);
    var cachID = id + '_' + lang
    var cached = Cache.get(cachID);
    if (cached) {
        console.log('cached main', cachID, cached);
        return cached
    } else {
        return subscene.getSubtitles(moviePath).then(subtitles => {
            //console.log(subtitles)
            var subs = subtitles[lang];
            if (subs) {
                //console.log(subs);
                for (let c = 0; c < (count || subs.length); c++) {
                    promises.push(subscene.download(subs[c].path).then(data => {
                        var name = slug + '_' + lang + '_' + c;
                        var subpath = path.join(__dirname, directory, name);
                        fs.writeFile(subpath, data[0].file.toString(), function (err) {
                            if (err) { console.log(err); }
                        });
                        var sub = {
                            lang: lang,
                            id: name,
                            url: "http://127.0.0.1:63355/data/" + encodeURI(name)
                        };
                        return sub;
                    }).catch(err => console.error(err))
                    );
                }
            }

            return promises;
        }).then(promises => {
            console.log(promises);
            console.log("Cache keys", Cache.keys());

            let subs = Promise.all(promises);
            let cached = Cache.set(cachID, subs);
            console.log("cached", cached)

            return subs;
        }).catch(err => console.error(err))
    }
}

async function clean() {
    try {
        console.log('Clearing cache...',Cache.getStats())
        Cache.flushAll();
        console.log('Cache cleared',Cache.getStats())

        console.log('Deleting old subtitles...')
        const files = await readdir(directory);
        const unlinkPromises = files.map(filename => unlink(`${directory}/${filename}`));
        return Promise.all(unlinkPromises).then(promise=>{console.log('Old subtitles deleted successfully'); return promise});
    } catch (err) {
        console.log(err);
    }
}



module.exports = { getsubtitles, clean };
