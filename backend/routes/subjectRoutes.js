const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
// const { auth, adminAuth } = require('../middleware/auth'); // assuming these exist or will be added

router.get('/', subjectController.getSubjects);
router.post('/', subjectController.createSubject);
router.put('/:id', subjectController.updateSubject);
router.delete('/:id', subjectController.deleteSubject);

module.exports = router;
