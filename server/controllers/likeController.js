const Like = require('../models/Like');
const Project = require('../models/Project');

const toggleLike = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const existing = await Like.findOne({ userUid: req.uid, project: project._id });
    if (existing) {
      await existing.deleteOne();
      project.likesCount = Math.max(0, project.likesCount - 1);
      await project.save();
      return res.json({ liked: false, likesCount: project.likesCount });
    }
    await Like.create({ userUid: req.uid, project: project._id });
    project.likesCount += 1;
    await project.save();
    res.json({ liked: true, likesCount: project.likesCount });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle like', error: err.message });
  }
};

module.exports = { toggleLike };
