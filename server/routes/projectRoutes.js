const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
} = require('../controllers/projectController');
const { addComment, deleteComment } = require('../controllers/commentController');
const { toggleBookmark } = require('../controllers/bookmarkController');
const { toggleLike } = require('../controllers/likeController');
const { rateProject } = require('../controllers/ratingController');

// NOTE: '/mine' must be declared before '/:id' or it will be matched as an id
router.get('/', getProjects);
router.get('/mine', protect, getMyProjects);
router.get('/:id', optionalAuth, getProjectById);
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

router.post('/:id/bookmark', protect, toggleBookmark);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/rating', protect, rateProject);

module.exports = router;
