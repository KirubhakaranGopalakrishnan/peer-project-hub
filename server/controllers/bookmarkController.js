const Bookmark = require('../models/Bookmark');
const Project = require('../models/Project');

const toggleBookmark = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const existing = await Bookmark.findOne({ userUid: req.uid, project: project._id });
    if (existing) {
      await existing.deleteOne();
      return res.json({ bookmarked: false });
    }
    await Bookmark.create({ userUid: req.uid, project: project._id });
    res.json({ bookmarked: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle bookmark', error: err.message });
  }
};

const getMyBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userUid: req.uid })
      .populate('project')
      .sort({ createdAt: -1 });
    res.json(bookmarks.map((b) => b.project).filter(Boolean));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookmarks', error: err.message });
  }
};

module.exports = { toggleBookmark, getMyBookmarks };
