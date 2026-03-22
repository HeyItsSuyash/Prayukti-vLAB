const express = require('express');
const router = express.Router();
const experimentController = require('../controllers/experimentController');

// Base routes
router.get('/', experimentController.getExperiments);
router.post('/', experimentController.createExperiment);

// Convenience / Seed routes
router.post('/create', experimentController.createExperiment);
router.post('/seed', experimentController.seedExperiments);

// Detail routes
router.get('/:experimentId', experimentController.getExperimentById);
router.put('/:id', experimentController.updateExperiment);
router.delete('/:id', experimentController.deleteExperiment);

// Filter routes
router.get('/subject/:subjectId', experimentController.getExperimentsBySubject);

module.exports = router;
