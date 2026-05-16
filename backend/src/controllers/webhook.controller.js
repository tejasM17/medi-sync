// backend/src/controllers/webhook.controller.js
const IncomingEmail = require('../models/IncomingEmail.model');
const Patient = require('../models/Patient.model');
const TriageReport = require('../models/TriageReport.model');
const { triageQueue } = require('../queues/triage.queue');
const ReportGeneratorService = require('../services/reportGenerator.service');
const { addLog } = require('../controllers/ai-log.controller');

/**
 * Initial notification from Python that processing has started
 */
const startPythonProcessing = async (req, res) => {
  try {
    const { email_body, task_id } = req.body;
    
    const fromEmail = "patient.auto@example.com";
    let patient = await Patient.findOne({ email: fromEmail });
    if (!patient) {
      patient = await Patient.create({ name: "Auto Patient", email: fromEmail });
    }

    const emailDoc = await IncomingEmail.create({
      patientId: patient._id,
      subject: "AI Processing...",
      body: email_body?.substring(0, 100) + "..." || "Incoming patient case",
      rawEmail: email_body || "N/A",
      status: 'Processing',
      extractedData: { taskId: task_id } // Store task_id for matching later
    });

    addLog("Orchestrator", "Task Started", `Python AI assigned Task ID: ${task_id}`);

    res.status(200).json({ success: true, emailId: emailDoc._id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Endpoint for Python AI to push completed results
 */
const receivePythonResult = async (req, res) => {
  try {
    const aiData = req.body;
    const { triage_report, research_facts, reflection, email_body, task_id } = aiData;

    // Find existing email record by task_id or create new
    let emailDoc = await IncomingEmail.findOne({ "extractedData.taskId": task_id });
    
    let patient;
    if (emailDoc) {
      patient = await Patient.findById(emailDoc.patientId);
    } else {
      const fromEmail = "patient.auto@example.com";
      patient = await Patient.findOne({ email: fromEmail });
      if (!patient) patient = await Patient.create({ name: "Auto Patient", email: fromEmail });
      
      emailDoc = await IncomingEmail.create({
        patientId: patient._id,
        subject: "AI Processed Case",
        body: email_body || "N/A",
        rawEmail: email_body || "N/A",
        status: 'Processing'
      });
    }

    // ... rest of the logic remains the same ...
    // Update existing record
    emailDoc.status = 'Processed';
    emailDoc.subject = triage_report.symptoms_list?.[0] ? `Triage: ${triage_report.symptoms_list[0]}` : "Triage Complete";
    emailDoc.body = email_body || emailDoc.body;

    // 3. Process Triage Logic
    const pythonUrgency = triage_report.urgency || "Low";
    const urgencyLevel = pythonUrgency === "High" ? "Emergency" : (pythonUrgency === "Medium" ? "Urgent" : "Routine");
    const isEmergency = urgencyLevel === "Emergency";

    const triageResult = {
      urgencyLevel,
      urgencyScore: isEmergency ? 95 : 75,
      summary: research_facts || "AI analysis complete.",
      detailedReasoning: reflection || triage_report.medical_guidance || "Clinical reflection attached.",
      recommendations: triage_report.symptoms_list || [],
      isEmergency: isEmergency
    };

    // 4. Save Triage Report
    const triageDoc = await TriageReport.create({
      emailId: emailDoc._id,
      patientId: patient._id,
      urgencyLevel: triageResult.urgencyLevel,
      urgencyScore: triageResult.urgencyScore,
      summary: triageResult.summary,
      detailedReasoning: triageResult.detailedReasoning,
      recommendations: triageResult.recommendations,
      isEmergency: triageResult.isEmergency
    });

    // 5. Generate PDF
    const pdfData = await ReportGeneratorService.generatePDF(triageResult, patient);
    const report = await ReportGeneratorService.createReportRecord(triageResult, patient, pdfData);

    // 6. Update Email with Extracted Data
    emailDoc.extractedData = {
      triageId: triageDoc._id,
      reportId: report._id,
      urgency: triageResult.urgencyLevel
    };
    await emailDoc.save();

    // 7. Add Live Logs for Dashboard
    addLog("Orchestrator", "Python AI Completed", `Processed Task: ${aiData.task_id}`);
    addLog("ResearcherAgent", "Insights Received", "Fetched medical facts from Python Agent");
    addLog("TriageOfficer", "Priority Set", `Urgency determined as: ${urgencyLevel}`);
    addLog("ReportGenerator", "PDF Ready", "Generated final report from Python AI data");

    res.status(200).json({ success: true, message: "Node.js updated successfully from Python AI" });

  } catch (error) {
    console.error("Python Callback Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Main Webhook for receiving new emails
 */
const receiveEmail = async (req, res) => {
  try {
    const { subject, body, from } = req.body;

    if (!body) {
      return res.status(400).json({ success: false, message: "Email body is required" });
    }

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

    console.log(`🤖 Starting Multi-Agent Pipeline for ${emailDoc._id}...`);
    
    triageQueue.add('triage', {
      emailId: emailDoc._id,
      patientId: patient._id,
      body: body
    });

    addLog("Orchestrator", "Task Received", "Added patient email to triage queue");

    res.status(201).json({
      success: true,
      message: "Patient case is being processed by the AI Multi-Agent Pipeline",
      emailId: emailDoc._id
    });

  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
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

module.exports = { receiveEmail, getAllEmails, receivePythonResult, startPythonProcessing };
