const needle = require("needle");
var slugify = require('slugify');


function cinemeta(type, tt) {

    return needle(
        "get",
`https://v3-cinemeta.strem.io/meta/${type}/${tt}.json`).then((res) => {
        const body = res.body;
        if (body && body.meta) {
            const meta = body.meta;
            const name = meta.name;
            const year = meta.year.substring(0, 4);
            var slug = slugify(name, {
                replacement: '-', // replace spaces with replacement character, defaults to `-`
                remove: undefined, // remove characters that match regex, defaults to `undefined`
                lower: true, // convert to lower case, defaults to `false`
                strict: true, // strip special characters except replacement, defaults to `false`
                trim: true // trim leading and trailing replacement chars, defaults to `true`
            });
            return {
                'name': name,
                'year': year,
                'slug': slug
            };
        }
        return Promise.reject();
    });
}
module.exports = cinemeta;
