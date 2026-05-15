// backend/src/services/agents/TriageReportAgent.js
const ReportGeneratorService = require('../reportGenerator.service');

class TriageReportAgent {
  async process(parserResult, researchResult, patient, email) {
    console.log("🧠 [TriageReportAgent] Making final decision...");

    const urgencyLevel = parserResult.extractedInfo.urgencyHints === "High" ? "Emergency" : "Urgent";

    const triageResult = {
      urgencyLevel,
      urgencyScore: urgencyLevel === "Emergency" ? 92 : 75,
      summary: researchResult.research.findings,
      detailedReasoning: `${parserResult.thinking} | ${researchResult.thinking}`,
      recommendations: ["Seek immediate medical attention", "Do not drive", "Inform family"],
      isEmergency: urgencyLevel === "Emergency"
    };

    // Generate PDF
    const pdfData = await ReportGeneratorService.generatePDF(triageResult, patient);
    const report = await ReportGeneratorService.createReportRecord(triageResult, patient, pdfData);

    return { triageResult, report };
  }
}

module.exports = new TriageReportAgent();
