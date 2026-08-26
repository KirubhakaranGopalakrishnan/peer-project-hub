const Project = require('../models/Project');
const User = require('../models/User');

const getAnalytics = async (req, res) => {
  try {
    const [totalProjects, totalUsers, mostLiked] = await Promise.all([
      Project.countDocuments(),
      User.countDocuments(),
      Project.findOne().sort({ likesCount: -1 }),
    ]);
    res.json({ totalProjects, totalUsers, mostLiked });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: err.message });
  }
};

module.exports = { getAnalytics };
