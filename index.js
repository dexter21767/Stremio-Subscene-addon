const express = require("express");
const app = express();
const cors = require('cors');
const path = require('path');
const { subtitles, proxyStream } = require('./subscene');
const manifest = require("./manifest.json");
const rateLimit = require('express-rate-limit')

const languages = require('./languages.json');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 30, // Limit each IP to 30 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.set('trust proxy', true)

app.use('/configure', express.static(path.join(__dirname, 'vue', 'dist')));
app.use('/assets', express.static(path.join(__dirname, 'vue', 'dist', 'assets')));

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
		if (languages[lang]) {
			subtitles(type, id, lang).then(subtitles => {
				//console.log('subtitles', subtitles)
				res.send(JSON.stringify({ subtitles: subtitles }));
				res.end();
			}).catch(error => { console.error(error); res.end(); })
		} else {
			res.end();
		}
	}
})

app.get('/:subtitles/:name/:language/:id.zip', limiter, (req, res) => {
	console.log(req.params);
	let {subtitles,name,language,id} = req.params;
	try {
		let path = `/${subtitles}/${name}/${language}/${id}`
		res.setHeader('Cache-Control', 'max-age=86400, public');
		res.setHeader('responseEncoding', 'null'); 
		res.setHeader('Content-Type', 'arraybuffer/json'); 
		console.log(path);
		proxyStream(path).then(response=>{
		res.send(response);
	} ).catch(err=> {console.log(err)})
	} catch (err) {
	  console.log(err)
	  return res.send("Couldn't get the subtitle.")
	}
  });

module.exports = app
