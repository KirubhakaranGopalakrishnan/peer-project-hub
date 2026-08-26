const User = require('../models/User');
const Project = require('../models/Project');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const projects = await Project.find({ ownerUid: req.params.uid }).sort({ createdAt: -1 });
    res.json({ user, projects });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

const updateMyProfile = async (req, res) => {
  const { displayName, bio, photoURL } = req.body;
  try {
    const user = await User.findOne({ uid: req.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (displayName) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (photoURL !== undefined) user.photoURL = photoURL;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

module.exports = { getUserProfile, updateMyProfile };
