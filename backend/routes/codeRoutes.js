const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');

// POST /api/code/run - Execute user code
router.post('/run', codeController.runCode);

// POST /api/code/complexity - Analyze time complexity
router.post('/complexity', codeController.analyzeComplexity);

module.exports = router;
