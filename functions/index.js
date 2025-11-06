const functions = require('firebase-functions');
const createApp = require('./src/app');

// Export Express app as a single HTTPS function
exports.api = functions.https.onRequest(createApp());
