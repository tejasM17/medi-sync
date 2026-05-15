// backend/src/controllers/report.controller.js
const GeneratedReport = require('../models/GeneratedReport.model');

const getAllReports = async (req, res) => {
  try {
    const reports = await GeneratedReport.find()
      .populate('patientId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const downloadReport = async (req, res) => {
  try {
    const report = await GeneratedReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    if (!report.pdfBase64) {
      return res.status(400).json({ success: false, message: "PDF not available for this report" });
    }

    const buffer = Buffer.from(report.pdfBase64, 'base64');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${report.pdfFileName || 'triage-report.pdf'}"`);
    res.send(buffer);
  } catch (error) {
    console.error("Download Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAllReports, downloadReport };
