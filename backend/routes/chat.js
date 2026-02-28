const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { verifyToken } = require('../utils/authMiddleware');

// Get or create anonymous chat profile for the logged in user
router.get('/user', verifyToken, chatController.getAnonymousUser);

// Fetch messages for a specific experiment
router.get('/:experimentId/messages', verifyToken, chatController.getMessages);

// Report a message
router.post('/report', verifyToken, chatController.reportMessage);

module.exports = router;
