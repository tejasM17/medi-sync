// backend/src/services/reportGenerator.service.js
const GeneratedReport = require('../models/GeneratedReport.model');
const pdfLib = require('pdf-lib'); // We'll use simple markdown for now

class ReportGeneratorService {
  async generateReport(triageResult, patient, email) {
    try {
      const report = await GeneratedReport.create({
        triageReportId: null, // Will link later
        patientId: patient._id,
        doctorId: null, // Add doctor later
        title: `Medical Triage Report - ${new Date().toLocaleDateString()}`,
        contentMarkdown: `
**Patient:** ${patient.email}
**Urgency:** ${triageResult.urgencyLevel} (${triageResult.urgencyScore}%)
**Summary:** ${triageResult.summary}

**Recommendations:**
${triageResult.recommendations.map(r => `- ${r}`).join('\n')}

**AI Reasoning:** ${triageResult.detailedReasoning}
        `,
        pdfUrl: "", // Will generate real PDF later
        isSentToPatient: false
      });

      console.log(`✅ Report Generated: ${report._id}`);
      return report;
    } catch (error) {
      console.error("Report Generation Failed:", error);
      throw error;
    }
  }
}

module.exports = new ReportGeneratorService();
