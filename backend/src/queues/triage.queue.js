// backend/src/queues/triage.queue.js
const axios = require('axios');
const ReportGeneratorService = require('../services/reportGenerator.service');
const Patient = require('../models/Patient.model');
const IncomingEmail = require('../models/IncomingEmail.model');
const TriageReport = require('../models/TriageReport.model');
const { addLog } = require('../controllers/ai-log.controller');

const PYTHON_API_URL = "http://localhost:8000/api/incoming-patient";
const PYTHON_REPORT_URL = "http://localhost:8000/api/reports";

const triageQueue = {
  add: async (name, data) => {
    console.log(`🚀 [Orchestrator] Triggering Python AI → Email: ${data.emailId}`);

    try {
      const patient = await Patient.findById(data.patientId);
      const emailDoc = await IncomingEmail.findById(data.emailId);

      // 1. Trigger the Python AI via POST
      addLog("Orchestrator", "Triggering AI", "Sending request to Python Multi-Agent System...");
      const postResponse = await axios.post(PYTHON_API_URL, {
        email_body: data.body
      });

      const taskId = postResponse.data.task_id;
      console.log(`📡 Python Task Created: ${taskId}`);
      addLog("Orchestrator", "Task Pending", `Python Task ID ${taskId} is now processing.`);

      // 2. Poll the Python GET endpoint for results
      const pollInterval = setInterval(async () => {
        try {
          console.log(`🔍 Polling Python for Task ${taskId}...`);
          // Note: Using the POST URL for polling status as per user backend structure
          const getResponse = await axios.get(`${PYTHON_API_URL}/${taskId}`);
          const aiData = getResponse.data;

          if (aiData.status === 'completed' || aiData.status === 'success') {
            clearInterval(pollInterval);
            console.log(`✅ Python Task ${taskId} Finished!`);

            // 3. Fetch the Final Structured Report from the NEW endpoint
            console.log(`📄 Fetching Structured Report for ${taskId}...`);
            const reportResponse = await axios.get(`${PYTHON_REPORT_URL}/${taskId}`);
            const structuredReport = reportResponse.data;

            // Map Python Structured Report to Node.js Logic
            const clinical = structuredReport.clinical_summary || {};
            const pythonUrgency = clinical.urgency_level || "Low";
            const urgencyLevel = pythonUrgency === "High" ? "Emergency" : (pythonUrgency === "Medium" ? "Urgent" : "Routine");
            const isEmergency = urgencyLevel === "Emergency";

            const triageResult = {
              urgencyLevel,
              urgencyScore: isEmergency ? 95 : 75,
              summary: clinical.initial_assessment || "No assessment provided.",
              detailedReasoning: structuredReport.research_background || "Clinical review complete.",
              recommendations: [
                ...(clinical.identified_symptoms || []),
                structuredReport.medical_guidance || "Consult a doctor."
              ],
              isEmergency: isEmergency
            };

            // Save Triage Report
            const triageDoc = await TriageReport.create({
              emailId: data.emailId,
              patientId: data.patientId,
              urgencyLevel: triageResult.urgencyLevel,
              urgencyScore: triageResult.urgencyScore,
              summary: triageResult.summary,
              detailedReasoning: triageResult.detailedReasoning,
              recommendations: triageResult.recommendations,
              isEmergency: triageResult.isEmergency
            });

            // Generate PDF Report
            addLog("ReportGenerator", "Generating PDF", "Converting structured AI data into a clinical PDF report.");
            const pdfData = await ReportGeneratorService.generatePDF(triageResult, patient);
            const report = await ReportGeneratorService.createReportRecord(triageResult, patient, pdfData);

            // Update Email Document
            emailDoc.status = 'Processed';
            emailDoc.symptoms = clinical.identified_symptoms || [];
            emailDoc.extractedData = {
              taskId: taskId,
              triageId: triageDoc._id,
              reportId: report._id,
              urgency: triageResult.urgencyLevel,
              professionalId: structuredReport.header?.report_id
            };
            await emailDoc.save();

            addLog("TriageOfficer", "Priority Finalized", `Case marked as ${urgencyLevel}.`);
            addLog("Orchestrator", "Success", "Pipeline complete. Structured report generated.");
          } else if (aiData.status === 'failed') {
            clearInterval(pollInterval);
            console.error(`❌ Python Task ${taskId} failed.`);
            addLog("Orchestrator", "Error", "Python AI processing failed.");
          }
        } catch (pollErr) {
          // Silent polling errors
        }
      }, 3000); 

    } catch (err) {
      console.error("❌ Failed to initiate Python Pipeline:", err.message);
      addLog("Orchestrator", "Connection Error", "Could not reach Python backend.");
    }
  }
};

module.exports = { triageQueue };
