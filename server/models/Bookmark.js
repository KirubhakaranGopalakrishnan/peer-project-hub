const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    userUid: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  },
  { timestamps: true }
);

bookmarkSchema.index({ userUid: 1, project: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
