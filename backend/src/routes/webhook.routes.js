// backend/src/routes/webhook.routes.js
const express = require('express');
const router = express.Router();
const { receiveEmail, getAllEmails } = require('../controllers/webhook.controller');

// POST - Receive patient email (Main Webhook)
router.post('/email', receiveEmail);

// GET - View all received emails (Useful for Doctor Dashboard + Testing)
router.get('/emails', getAllEmails);

// GET - Single email by ID
router.get('/email/:id', async (req, res) => {
  // We will implement this in next phase if needed
  res.json({ message: "Single email route ready" });
});

module.exports = router;
