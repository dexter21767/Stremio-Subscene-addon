const axios = require('axios').default;
const BaseURL = require('./config').kitsuURL;
require('dotenv').config();

async function request(url, header) {

    return await axios
        .get(url, header, { timeout: 5000 })
        .then(res => {
            return res;
        })
        .catch(error => {
            if (error.response) {
                console.error('error on kitsu.js request:', error.response.status, error.response.statusText, error.config.url);
            } else {
                console.error(error);
            }
        });

}

async function getMeta(id) {
    //let url = `${BaseURL}/anime?filter[text]=${encodeURIComponent(slug)}`
    let url = `${BaseURL}/anime/${id}`

    let res = await request(url);
    let attributes = res.data.data.attributes;
    //console.log(attributes)
    return {title: attributes.titles,year:attributes.startDate.split("-")[0],slug:attributes.slug }
}

//getMeta("1").then(meta => (console.log(meta)))
module.exports = getMeta;