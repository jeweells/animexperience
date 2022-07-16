const functions = require('firebase-functions')
const url = require('url');

function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

function encodeDoubleQuotes(s) {
    return s.replace('"', '\\"')
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions


exports.watch = functions.https.onRequest((request, response) => {
    const params = new URLSearchParams()
    if (!request.query.q) return response.status(404)
    params.set('q', String(request.query.q))
    const url = `animexp://watch/?${params.toString()}`
    const data = JSON.parse(Buffer.from(params.get('q'), 'base64').toString('utf8'))
    const title = data.u.split('-').map(word => word.substring(0, 1).toUpperCase() + word.substring(1)).join(' ')
    const episode = data.ep
    const img = data.i
    const reqUrl = request.protocol + '://' + request.get('host') + request.originalUrl;
    const description = `Ver episodio ${episode} de ${title} en AnimExperience`
    if (!Number.isFinite(episode)) return response.status(404)
    response.setHeader('Content-Type', 'text/html')
    response.send(`<!DOCTYPE html><html lang="es"><head>` +
        `<meta charset="utf-8">` +
        `<script>window.location.href='${url}'</script>` +
        `<title>AnimExperience</title>` +
        `<meta property="og:title" content="${encodeDoubleQuotes(title.substring(0, 35))}" />` +
        `<meta property="og:url" content="${reqUrl}">` +
        `<meta content="es" http-equiv="content-language">` +
        `<meta content="es" name="language">` +
        `<meta property="og:site_name" content="AnimExperience">` +
        `<meta name="description" content="${description}" />` +
        `<meta property="og:description" content="${description}" />` +
        (img ? `<meta property="og:image" content="https://www3.animeflv.net/uploads/animes/thumbs/${encodeDoubleQuotes(img)}" />` : '') +
        `</head><body></body></html>`)
})
