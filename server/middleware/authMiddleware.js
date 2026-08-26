const admin = require('../config/firebaseAdmin');
const User = require('../models/User');

// Requires a valid Firebase ID token. Auto-creates a matching User
// document on first request so the rest of the app never has to worry
// about "user doesn't exist yet" edge cases.
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  try {
    const idToken = authHeader.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.uid = decoded.uid;

    let user = await User.findOne({ uid: decoded.uid });
    if (!user) {
      user = await User.create({
        uid: decoded.uid,
        email: decoded.email || '',
        displayName: decoded.name || (decoded.email ? decoded.email.split('@')[0] : 'User'),
        photoURL: decoded.picture || '',
      });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Attaches req.uid if a valid token is present, but never blocks the
// request. Used on public routes that behave slightly differently for
// logged-in users (e.g. showing "is this bookmarked by me").
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return next();
  try {
    const idToken = authHeader.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.uid = decoded.uid;
  } catch (err) {
    // invalid/expired token on an optional route just means "not logged in"
  }
  next();
};

module.exports = { protect, optionalAuth };
