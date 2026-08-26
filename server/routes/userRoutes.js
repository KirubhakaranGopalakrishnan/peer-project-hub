const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserProfile, updateMyProfile } = require('../controllers/userController');
const { getMyBookmarks } = require('../controllers/bookmarkController');

// NOTE: '/me/bookmarks' must come before '/:uid'
router.get('/me/bookmarks', protect, getMyBookmarks);
router.put('/me', protect, updateMyProfile);
router.get('/:uid', getUserProfile);

module.exports = router;
