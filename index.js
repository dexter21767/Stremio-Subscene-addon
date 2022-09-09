
const express = require('express');
const app = express();
const cors = require('cors');

const subscene = require('./subscene');
var manifest = require("./manifest.json");

const landingTemplate = require('./landingTemplate');

app.use(express.static('data'))
app.use(cors())

app.get('/', (_, res) => {
	res.redirect('/configure')
	res.end();
});

app.get('/:configuration?/configure', (req, res) => {
	res.setHeader('content-type', 'text/html');
	res.end(landingTemplate());
});

app.get('/manifest.json', (req, res) => {
	res.setHeader('Cache-Control', 'max-age=86400, public');
	res.setHeader('Content-Type', 'application/json');
	res.send(manifest);
	res.end();
});

app.get('/:configuration?/manifest.json', (req, res) => {
	res.setHeader('Cache-Control', 'max-age=86400, public');
	res.setHeader('Content-Type', 'application/json');
	res.send(manifest);
	res.end();
});

app.get('/:configuration?/:resource/:type/:id/:extra?.json', (req, res) => {
	//http://127.0.0.1:63355/subtitles/movie/tt1745960.json
	res.setHeader('Cache-Control', 'max-age=86400, public');
	res.setHeader('Content-Type', 'application/json');

	console.log(req.params);
	const { configuration, resource, type, id } = req.params;

	//const extra = req.params.extra ? req.parse(req.url.split('/').pop().slice(0, -5)) : {}
	if(configuration!== "subtitles"){
	var langs = configuration.split('|')[0].split('=')
	if (langs.length > 1 && langs[1].length > 1) {
		langs = langs[1].split(',');
	} else {
		langs.length = 0;
	}

	var count = configuration.split('|')[1].split('=')[1];
	console.log("langs",langs,' count', count);
	subscene(type, id, langs, count).then(promises => {
		Promise.all(promises).then(subtitles => {
			console.log('subtitles',subtitles)
			res.send(JSON.stringify({ subtitles: subtitles }));
			res.end();
		})
	}).catch(error=>{console.error(error); res.end();})
	
}	
})

module.exports = app
