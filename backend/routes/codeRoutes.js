const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');

// POST /api/code/run - Execute user code
router.post('/run', codeController.runCode);

module.exports = router;
