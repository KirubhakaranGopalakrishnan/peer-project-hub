const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    userUid: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    value: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

ratingSchema.index({ userUid: 1, project: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
