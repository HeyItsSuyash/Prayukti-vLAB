const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');

router.post('/', settingController.upsertSetting);
router.get('/', settingController.getSettings);

module.exports = router;
