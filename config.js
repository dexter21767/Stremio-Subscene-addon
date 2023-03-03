var env = process.env.NODE_ENV ? 'beamup':'local';

var config = {
    BaseURL: "https://subscene.com",
    APIURL: 'https://api.themoviedb.org/3',
    kitsuURL: 'https://kitsu.io/api/edge',
    CacheControl :{
        oneDay: 'max-age=86400, must-revalidate, stale-while-revalidate=1800, stale-if-error=1800, public',
        oneHour: 'max-age=3600, must-revalidate, stale-while-revalidate=1800, stale-if-error=1800, public',
        off: 'no-cache, no-store, must-revalidate'
    }
}

switch (env) {
    case 'beamup':
		config.port = process.env.PORT
        config.local = "https://2ecbbd610840-subscene.baby-beamup.club"
        break;

    case 'local':
		config.port = 63555
        config.local = "http://127.0.0.1:" + config.port;
        break;
}

module.exports = config;