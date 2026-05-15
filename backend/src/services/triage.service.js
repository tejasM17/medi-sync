const EmailParserAgent = require('../services/agents/EmailParserAgent');
const ResearcherAgent = require('../services/agents/ResearcherAgent');
const TriageReportAgent = require('../services/agents/TriageReportAgent');
const Patient = require('../models/Patient.model');

const triageQueue = {
  add: async (name, data) => {
    console.log(`🚀 [Orchestrator] Starting Multi-Agent Pipeline for email ${data.emailId}`);

    setTimeout(async () => {
      try {
        const patient = await Patient.findById(data.patientId);

        // Agent 1
        const parserResult = await EmailParserAgent.parse(data.body);

        // Agent 2
        const researchResult = await ResearcherAgent.research(parserResult.rawSymptoms);

        // Agent 3 (Coordinator)
        const finalResult = await TriageReportAgent.process(parserResult, researchResult, patient, data);

        console.log(`🎉 [Multi-Agent Complete] Report Generated: ${finalResult.report._id}`);
      } catch (err) {
        console.error("❌ Multi-Agent Pipeline Failed:", err);
      }
    }, 2500);
  }
};

module.exports = { triageQueue };
