const Rating = require('../models/Rating');
const Project = require('../models/Project');

const rateProject = async (req, res) => {
  const { value } = req.body;
  if (!value || value < 1 || value > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    await Rating.findOneAndUpdate(
      { userUid: req.uid, project: project._id },
      { value },
      { upsert: true, new: true }
    );

    const ratings = await Rating.find({ project: project._id });
    const avg = ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;
    project.avgRating = Math.round(avg * 10) / 10;
    project.ratingsCount = ratings.length;
    await project.save();

    res.json({ avgRating: project.avgRating, ratingsCount: project.ratingsCount, myRating: value });
  } catch (err) {
    res.status(500).json({ message: 'Failed to rate project', error: err.message });
  }
};

module.exports = { rateProject };
