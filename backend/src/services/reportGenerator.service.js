// backend/src/services/reportGenerator.service.js
const GeneratedReport = require('../models/GeneratedReport.model');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

class ReportGeneratorService {
  
  async generatePDF(triageResult, patient) {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]); // A4 size
      const { height } = page.getSize();
      
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      let y = height - 80;

      // Header
      page.drawText('MEDI-SYNC', { x: 50, y: y, size: 28, font: boldFont, color: rgb(0, 0.4, 0.8) });
      y -= 40;
      page.drawText('AI TRIAGE REPORT', { x: 50, y: y, size: 18, font: boldFont });

      y -= 50;
      page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 50, y: y, size: 12, font });

      y -= 40;
      page.drawText(`Patient Email: ${patient.email}`, { x: 50, y: y, size: 13, font: boldFont });

      y -= 40;
      const urgencyColor = triageResult.urgencyLevel === 'Emergency' ? rgb(0.9, 0.1, 0.1) : rgb(1, 0.55, 0);
      page.drawText(`Urgency: ${triageResult.urgencyLevel} (${triageResult.urgencyScore}%)`, { 
        x: 50, y: y, size: 16, font: boldFont, color: urgencyColor 
      });

      y -= 60;
      page.drawText('Summary', { x: 50, y: y, size: 14, font: boldFont });
      y -= 25;
      page.drawText(triageResult.summary, { x: 50, y: y, size: 11, font, maxWidth: 480 });

      y -= 60;
      page.drawText('Recommendations', { x: 50, y: y, size: 14, font: boldFont });
      y -= 30;

      triageResult.recommendations?.forEach((rec, i) => {
        page.drawText(`• ${rec}`, { x: 60, y: y, size: 11, font });
        y -= 28;
      });

      const pdfBytes = await pdfDoc.save();
      
      return {
        pdfBase64: Buffer.from(pdfBytes).toString('base64'),
        fileName: `MediSync_Triage_Report_${Date.now()}.pdf`
      };
    } catch (e) {
      console.error("PDF Generation Failed:", e);
      throw e;
    }
  }

  async createReportRecord(triageResult, patient, pdfData) {
    const report = await GeneratedReport.create({
      patientId: patient._id,
      title: `Triage Report - ${triageResult.urgencyLevel}`,
      contentMarkdown: triageResult.summary,
      pdfBase64: pdfData.pdfBase64,
      pdfFileName: pdfData.fileName,
      isSentToPatient: false
    });
    return report;
  }
}

module.exports = new ReportGeneratorService();
