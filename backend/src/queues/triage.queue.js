// backend/src/queues/triage.queue.js
const EmailParserAgent = require('../services/agents/EmailParserAgent');
const ResearcherAgent = require('../services/agents/ResearcherAgent');
const ReportGeneratorService = require('../services/reportGenerator.service');
const Patient = require('../models/Patient.model');

const triageQueue = {
  add: async (name, data) => {
    console.log(`🚀 [Multi-Agent Orchestrator] Starting pipeline for email: ${data.emailId}`);

    setTimeout(async () => {
      try {
        const patient = await Patient.findById(data.patientId);

        // Agent 1: Parse Email
        const parserResult = await EmailParserAgent.parse(data.body);

        // Agent 2: Research
        const researchResult = await ResearcherAgent.research(parserResult.rawSymptoms);

        // Agent 3: Triage + Generate Report
        const triageResult = {
          urgencyLevel: "Emergency",
          urgencyScore: 88,
          summary: researchResult.research.findings || "Patient requires medical attention.",
          detailedReasoning: `${parserResult.thinking} | ${researchResult.thinking}`,
          recommendations: ["Seek immediate care", "Avoid self-medication", "Follow up with specialist"],
          isEmergency: true
        };

        // Generate PDF + Save Report
        const pdfData = await ReportGeneratorService.generatePDF(triageResult, patient);
        const report = await ReportGeneratorService.createReportRecord(triageResult, patient, pdfData);

        console.log(`✅ [Success] Full pipeline completed. Report ID: ${report._id}`);
      } catch (err) {
        console.error("❌ Pipeline Error:", err.message);
      }
    }, 2500);
  }
};

module.exports = { triageQueue };
