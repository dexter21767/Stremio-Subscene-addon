const cinemeta = require('./lib/cinemeta');
const subscene = require("node-subscene-api")
    const fs = require('fs');
const path = require('path');

async function getsubtitle(type, id) {
    console.log('getting cinemeta', type, id);
    return cinemeta(type, id).then(meta => {
        console.log('cinemeta done', meta);
        var slug = meta.slug;
        var lang = "arabic";
        var moviePath = '/subtitles/' + slug + '/' + lang;
        console.log(moviePath);
        return subscene.getSubtitles(moviePath).then(subs => {
            console.log("got sub");
            subs = subs[lang];
            return downloadsubs(subs, lang).then(subtitles => {
                console.log(subtitles)
                return subtitles;
            })
        })
    })

}
async function downloadsubs(subs, lang) {
    console.log("downloading subs");
    if (subs.length > 5) {
        var length = 2;
    } else {
        var length = subs.length;
    }
    let subtitles = [];
    for (let i = 0; i < length; i++) {
        console.log("for ", i);

        let dl = await subscene.download(subs[i].path, {
            zip: false
        });
        var name = dl[0].filename;
        var subpath = path.join(__dirname, "data", name);
        subtitles.push({
            lang: lang + ' dexter',
            id: i,
            url: "http://127.0.0.1:63355/data/" + encodeURI(name)
            //url: "http://127.0.0.1:11470/subtitles.vtt?from="+encodeURIComponent("https://127.0.0.1:63355/data/"+name)
        });
        await fs.writeFileSync(subpath, dl[0].file.toString());

    }
    return subtitles;

}

module.exports = getsubtitle;
