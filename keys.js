console.log("this is loaded");

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET,
}

exports.omdb = {
    api: process.env.OMDB_API,
}

exports.bands = {
    api: process.env.BANDS_API,
}