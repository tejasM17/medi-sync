// backend/src/controllers/webhook.controller.js
const axios = require('axios');
const IncomingEmail = require('../models/IncomingEmail.model');
const Patient = require('../models/Patient.model');

const PYTHON_AI_URL = "http://localhost:8000/api/incoming-patient";

const receiveEmail = async (req, res) => {
  try {
    const { subject, body, from } = req.body;

    if (!body) {
      return res.status(400).json({ success: false, message: "Email body is required" });
    }

    // Save incoming email
    let patient = await Patient.findOne({ email: (from || "").toLowerCase() });
    if (!patient) {
      patient = await Patient.create({ 
        name: (from || "Patient").split('@')[0], 
        email: (from || "").toLowerCase() 
      });
    }

    const emailDoc = await IncomingEmail.create({
      patientId: patient._id,
      subject: subject || "New Patient Message",
      body,
      rawEmail: body,
      status: 'Processing'
    });

    // Call Python AI Agent
    console.log(`🤖 Forwarding to Python Multi-Agent System...`);
    
    const aiResponse = await axios.post(PYTHON_AI_URL, {email_body: body});

    // Log steps
const { addLog } = require('../controllers/ai-log.controller');

addLog("EmailParserAgent", "Parsing incoming email", "Extracted symptoms from patient message");
addLog("ResearcherAgent", "Web Search + Analysis", "Queried medical guidelines using Gemini");
addLog("TriageOfficer", "Final Decision Making", `Determined urgency: ${aiResponse.data.triage_report?.urgency}`);
addLog("ReportGenerator", "PDF Report Created", "Generated professional triage report");

    console.log(`✅ AI Processing Done → Urgency: ${aiResponse.data.triage_report?.urgency}`);

    res.status(201).json({
      success: true,
      task_id: aiResponse.data.task_id,
      triage: aiResponse.data.triage_report,
      message: "Patient case processed by AI Multi-Agent Pipeline"
    });

  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

const getAllEmails = async (req, res) => {
  try {
    const emails = await IncomingEmail.find()
      .populate('patientId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: emails });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { receiveEmail, getAllEmails };
