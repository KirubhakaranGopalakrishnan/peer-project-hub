const Comment = require('../models/Comment');
const Project = require('../models/Project');

const addComment = async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ message: 'Comment text is required' });
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const comment = await Comment.create({
      project: project._id,
      authorUid: req.uid,
      authorName: req.user.displayName,
      text: text.trim(),
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.authorUid !== req.uid) return res.status(403).json({ message: 'Not authorized' });
    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment', error: err.message });
  }
};

module.exports = { addComment, deleteComment };
