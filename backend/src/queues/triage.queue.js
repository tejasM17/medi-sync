// backend/src/queues/triage.queue.js
const EmailParserAgent = require('../services/agents/EmailParserAgent');
const ResearcherAgent = require('../services/agents/ResearcherAgent');
const ReportGeneratorService = require('../services/reportGenerator.service');
const Patient = require('../models/Patient.model');

const triageQueue = {
  add: async (name, data) => {
    console.log(`🚀 [Orchestrator] Starting Multi-Agent Workflow → Email: ${data.emailId}`);

    setTimeout(async () => {
      try {
        const patient = await Patient.findById(data.patientId);

        // ====================== AGENT 1 ======================
        console.log("→ [Agent 1] EmailParserAgent running...");
        const parserResult = await EmailParserAgent.parse(data.body);

        // ====================== AGENT 2 ======================
        console.log("→ [Agent 2] ResearcherAgent running...");
        // Inside the setTimeout block
const researchResult = await ResearcherAgent.research(
  parserResult.rawSymptoms, 
  patient.email, 
  data.body
);

        // ====================== AGENT 3 ======================
        console.log("→ [Agent 3] TriageReportAgent running...");
        const triageResult = {
          urgencyLevel: parserResult.extractedInfo.urgencyHints === "High" ? "Emergency" : "Urgent",
          urgencyScore: 88,
          summary: researchResult.research.findings,
          detailedReasoning: `${parserResult.thinking}\n${researchResult.thinking}`,
          recommendations: ["Immediate medical consultation", "Do not ignore symptoms", "Inform family member"],
          isEmergency: true
        };

        // Generate PDF Report
        const pdfData = await ReportGeneratorService.generatePDF(triageResult, patient);
        const report = await ReportGeneratorService.createReportRecord(triageResult, patient, pdfData);

        console.log(`🎉 [Multi-Agent Success] Workflow Completed! Report ID: ${report._id}`);
      } catch (err) {
        console.error("❌ Multi-Agent Pipeline Failed:", err.message);
      }
    }, 3000);
  }
};

module.exports = { triageQueue };
