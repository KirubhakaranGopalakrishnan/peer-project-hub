const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    githubUrl: { type: String, required: true },
    liveUrl: { type: String, default: '' },
    ownerUid: { type: String, required: true, index: true },
    ownerName: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Project', projectSchema);
