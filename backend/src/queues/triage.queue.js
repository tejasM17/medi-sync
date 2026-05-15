// backend/src/queues/triage.queue.js
const AIService = require('../services/ai.service');
const ReportGeneratorService = require('../services/reportGenerator.service');
const Patient = require('../models/Patient.model');

const triageQueue = {
  add: async (name, data) => {
    console.log(`📤 [Queue] New triage job for email: ${data.emailId}`);

    setTimeout(async () => {
      try {
        // Step 1: AI Analysis
        const triageResult = await AIService.analyzeSymptoms(data.body);

        // Step 2: Find Patient
        const patient = await Patient.findById(data.patientId);

        // Step 3: Generate Report
        await ReportGeneratorService.generateReport(triageResult, patient, data);

        console.log(`🎉 Full Triage Pipeline Completed for ${data.emailId}`);
      } catch (err) {
        console.error("Pipeline Error:", err);
      }
    }, 2000);

    return { id: Date.now().toString() };
  }
};

console.log('✅ Mock AI Pipeline Ready');

module.exports = { triageQueue };
