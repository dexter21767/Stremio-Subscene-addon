const axios = require('axios').default;
var slugify = require('slugify');
const BaseURL = require('./config').APIURL;
require('dotenv').config();

async function request(url, header) {

    return await axios
        .get(url, header, { timeout: 5000 })
        .then(res => {
            return res;
        })
        .catch(error => {
            if (error.response) {
                console.error('error on tmdb.js request:', error.response.status, error.response.statusText, error.config.url);
            } else {
                console.error(error);
            }
        });

}

async function getMeta(type, id) {
    if (type == "movie") {
        let url = `${BaseURL}/movie/${id}?api_key=${process.env.API_KEY}`
        let res = await request(url);
        console.log(res.data.title)
        let title = res.data.original_title.match(/[\u3400-\u9FBF]/) ? res.data.title : res.data.original_title;
        var slug = slugify(title, { replacement: '-', remove: undefined, lower: true, strict: true, trim: true });
        return { title: title, slug: slug }
    } else if (type == "series") {
        let url = `${BaseURL}/find/${id}?api_key=${process.env.API_KEY}&external_source=imdb_id`
        let res = await request(url);
        //if ()
        console.log(res.data)
        let title = res.data.tv_results[0].original_name.match(/[\u3400-\u9FBF]/) ? res.data.tv_results[0].name : res.data.tv_results[0].original_name;
        var slug = slugify(title, { replacement: '-', remove: undefined, lower: true, strict: true, trim: true });
        return { title: title, slug: slug }
    }
}

//getMeta("series", 'tt0903747').then(meta => (console.log(meta)))
module.exports = getMeta;