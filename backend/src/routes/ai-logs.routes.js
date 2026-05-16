const express = require('express');
const router = express.Router();
const { getLogs, clearLogs, externalLog } = require('../controllers/ai-log.controller');

router.get('/', getLogs);
router.post('/', externalLog);
router.delete('/', clearLogs);

module.exports = router;
