#!/usr/bin/env node

const {app,clean} = require('./index.js')
const { serveHTTP, publishToCentral } = require("stremio-addon-sdk")

// create local server
app.listen((process.env.PORT || 63355), function () {
    console.log(`Addon active on port ${process.env.PORT || 63355} .`);
    console.log(`HTTP addon accessible at: http://127.0.0.1:${process.env.PORT || 63355}/manifest.json`);
	var minutes = 60, the_interval = minutes * 60 * 1000;

    setInterval(clean, the_interval);

	
});



//publishToCentral("https://2ecbbd610840-subscene.baby-beamup.club/manifest.json")