const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    displayName: { type: String, required: true },
    bio: { type: String, default: '' },
    photoURL: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
