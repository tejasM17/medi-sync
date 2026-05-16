const express = require('express');
const router = express.Router();
const { getLogs, clearLogs } = require('../controllers/ai-log.controller');

router.get('/', getLogs);
router.delete('/', clearLogs);

module.exports = router;
