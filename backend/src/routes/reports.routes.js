// backend/src/routes/reports.routes.js
const express = require('express');
const router = express.Router();
const { getAllReports, downloadReport } = require('../controllers/report.controller');

// GET all reports
router.get('/', getAllReports);

// Download PDF
router.get('/download/:id', downloadReport);

module.exports = router;
