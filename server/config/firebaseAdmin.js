const admin = require('firebase-admin');

// FIREBASE_SERVICE_ACCOUNT_KEY must contain the full service account JSON
// (from Firebase Console -> Project Settings -> Service Accounts ->
// Generate new private key) as a single-line string in .env.
let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} catch (err) {
  console.error('FIREBASE_SERVICE_ACCOUNT_KEY is missing or not valid JSON.');
  throw err;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
