const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions


exports.watch = functions.https.onRequest((request, response) => {
  const params = new URLSearchParams();
  params.set('q', String(request.query.q));
  response.redirect('animexp://watch/?' + params.toString());
});
