const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');

router.post('/create', subjectController.createSubject);
router.get('/', subjectController.getAllSubjects);
router.post('/seed', subjectController.seedSubjects);

module.exports = router;
