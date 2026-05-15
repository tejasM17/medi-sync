// backend/src/controllers/webhook.controller.js
const IncomingEmail = require('../models/IncomingEmail.model');
const Patient = require('../models/Patient.model');
const { triageQueue } = require('../queues/triage.queue');

const receiveEmail = async (req, res) => {
  try {
    const { subject, body, from, rawEmail } = req.body;

    if (!from || !body) {
      return res.status(400).json({ success: false, message: "from and body are required" });
    }

    let patient = await Patient.findOne({ email: from.toLowerCase() });
    if (!patient) {
      patient = await Patient.create({ 
        name: from.split('@')[0], 
        email: from.toLowerCase() 
      });
    }

    const emailDoc = await IncomingEmail.create({
      patientId: patient._id,
      subject: subject || "New Patient Message",
      body,
      rawEmail: rawEmail || body,
      status: 'Received'
    });

    // After creating emailDoc
await triageQueue.add('process-triage', {
  emailId: emailDoc._id,
  patientId: patient._id,
  body: body
});

console.log(`📤 Email queued for AI triage: ${emailDoc._id}`);

    res.status(201).json({
      success: true,
      message: "Email received successfully and queued for AI triage",
      emailId: emailDoc._id,
      patientId: patient._id
    });

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all emails (for dashboard)
const getAllEmails = async (req, res) => {
  try {
    const emails = await IncomingEmail.find()
      .populate('patientId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, count: emails.length, data: emails });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { receiveEmail, getAllEmails };
