const express = require('express');
const router = express.Router();
const experimentController = require('../controllers/experimentController');

router.post('/seed', experimentController.seedExperiments);
router.post('/', experimentController.createExperiment);
router.post('/create', experimentController.createExperiment);
router.get('/subject/:subjectId', experimentController.getExperimentsBySubject);
router.get('/', experimentController.getExperiments);
router.get('/:experimentId', experimentController.getExperimentById);

module.exports = router;
