const cinemeta = require('./lib/cinemeta');
const subscene = require("node-subscene-api")
const fs = require('fs');
const path = require('path');


async function getsubtitles(type, id, langs, count) {
    const promises = [];
    return cinemeta(type, id).then(meta => {
        var slug = meta.slug;
        var moviePath = '/subtitles/' + slug;
        return subscene.getSubtitles(moviePath).then(subtitles => {
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
                            var sub =  {
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
        }).catch(err => console.log(err))
    })
}





module.exports = getsubtitles;
