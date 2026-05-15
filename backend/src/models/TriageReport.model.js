const mongoose = require('mongoose');

const triageReportSchema = new mongoose.Schema({
  emailId: { type: mongoose.Schema.Types.ObjectId, ref: 'IncomingEmail' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  urgencyLevel: { type: String, enum: ['Emergency', 'Urgent', 'Routine', 'Low'] },
  urgencyScore: { type: Number, min: 1, max: 100 },
  summary: String,
  detailedReasoning: String,
  researchFindings: mongoose.Schema.Types.Mixed,
  recommendations: [String],
  isEmergency: Boolean,
}, { timestamps: true });

module.exports = mongoose.model('TriageReport', triageReportSchema);
