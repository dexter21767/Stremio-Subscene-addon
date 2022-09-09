const cinemeta = require('./lib/cinemeta');
const subscene = require("node-subscene-api")
const fs = require('fs');
const path = require('path');

const NodeCache = require("node-cache");
const Cache = new NodeCache({ stdTTL: 10000, checkperiod: 12000 });
const count = 5;

async function getsubtitles(type, id, langs) {
    const promises = [];
    var meta = await cinemeta(type, id)
    var slug = meta.slug;
    var moviePath = '/subtitles/' + slug;
    console.log(moviePath);
    return subscene.getSubtitles(moviePath).then(subtitles => {
        console.log(subtitles)
        for (let i = 0; i < langs.length; i++) {
            var subs = subtitles[langs[i]];
            if (subs !== undefined) {
                for (let c = 0; c < (count || subs.length); c++) {
                    promises.push(subscene.download(subs[c].path).then(data => {
                        var name = slug + '_' + langs[i] + '_' + c;
                        var subpath = path.join(__dirname, "data", name);
                        fs.writeFile(subpath, data[0].file.toString(), function (err) {
                            if (err) { console.log(err); }
                        });
                        var sub = {
                            lang: langs[i],
                            id: name,
                            url: "http://127.0.0.1:63355/" + encodeURI(name)
                        };
                        return sub;
                    })
                    );
                }
            }
        }
        return promises;
    }).then(promises => {
        console.log(promises);
        return Promise.all(promises);
    }).catch(err => console.error(err))
}





module.exports = getsubtitles;
