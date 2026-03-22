const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');

// Base routes
router.get('/', subjectController.getSubjects);
router.post('/', subjectController.createSubject);

// Convenience / Seed routes
router.post('/create', subjectController.createSubject);
router.post('/seed', subjectController.seedSubjects);

// Detail routes
router.put('/:id', subjectController.updateSubject);
router.delete('/:id', subjectController.deleteSubject);

module.exports = router;
