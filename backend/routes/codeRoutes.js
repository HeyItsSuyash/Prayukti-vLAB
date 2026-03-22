const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');
const experimentActivityMiddleware = require('../middleware/experimentActivityMiddleware');

// POST /api/code/run - Execute user code with activity tracking
router.use('/run', experimentActivityMiddleware.trackExperimentRun);
router.post('/run', codeController.runCode);

// POST /api/code/complexity - Analyze time complexity
router.post('/complexity', codeController.analyzeComplexity);

module.exports = router;
