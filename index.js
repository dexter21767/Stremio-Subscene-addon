
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const { getsubtitles, clean } = require('./subscene');
const manifest = require("./manifest.json");

//const landingTemplate = require('./landingTemplate');
const languages = require('./languages.json');


app.set('trust proxy', true)

app.use('/configure', express.static(path.join(__dirname, 'vue', 'dist')));
app.use('/assets', express.static(path.join(__dirname, 'vue', 'dist', 'assets')));

app.use('/data',express.static('data'))

app.use(cors())

app.get('/', (_, res) => {
	res.redirect('/configure')
	res.end();
});

app.get('/:configuration?/configure', (req, res) => {
	res.setHeader('Cache-Control', 'max-age=86400,staleRevalidate=stale-while-revalidate, staleError=stale-if-error, public');
	res.setHeader('content-type', 'text/html');
	res.sendFile(path.join(__dirname, 'vue', 'dist', 'index.html'));
});
/*
app.get('/:configuration?/configure', (_, res) => {
	res.setHeader('content-type', 'text/html');
	res.end(landingTemplate());
});
*/

app.get('/manifest.json', (_, res) => {
	res.setHeader('Cache-Control', 'max-age=86400, public');
	res.setHeader('Content-Type', 'application/json');
	manifest.behaviorHints.configurationRequired = true;
	res.send(manifest);
	res.end();
});

app.get('/:configuration?/manifest.json', (_, res) => {
	res.setHeader('Cache-Control', 'max-age=86400, public');
	res.setHeader('Content-Type', 'application/json');
	manifest.behaviorHints.configurationRequired = false;
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
	if (configuration !== "subtitles" && configuration) {
		
		//let lang = configuration.split('|')[0].split('=')[1]
		let lang = configuration;
		console.log("Language", lang); 
		if (languages.some(e => e.id === lang)) {
			getsubtitles(type, id, lang).then(subtitles => {
				//console.log('subtitles', subtitles)
				res.send(JSON.stringify({ subtitles: subtitles }));
				res.end();
			}).catch(error => { console.error(error); res.end(); })
		} else {
			res.end();
		}
	}
})

module.exports = { app, clean }
