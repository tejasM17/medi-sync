const mongoose = require('mongoose');

const generatedReportSchema = new mongoose.Schema({
  triageReportId: { type: mongoose.Schema.Types.ObjectId, ref: 'TriageReport' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  title: String,
  contentMarkdown: String,
  pdfUrl: String,
  isSentToPatient: { type: Boolean, default: false },
sentAt: Date,
sentVia: { type: String, default: 'EmailJS' }
}, { timestamps: true });

module.exports = mongoose.model('GeneratedReport', generatedReportSchema);
