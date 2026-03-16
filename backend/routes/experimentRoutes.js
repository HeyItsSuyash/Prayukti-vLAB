const express = require('express');
const router = express.Router();
const experimentController = require('../controllers/experimentController');

router.post('/', experimentController.createExperiment);
router.get('/', experimentController.getExperiments);
router.put('/:id', experimentController.updateExperiment);
router.delete('/:id', experimentController.deleteExperiment);

module.exports = router;
