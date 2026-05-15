const mongoose = require('mongoose');

const incomingEmailSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  subject: String,
  body: String,
  rawEmail: String,
  symptoms: [String],
  extractedData: mongoose.Schema.Types.Mixed,
  status: { type: String, enum: ['Received', 'Processing', 'Processed', 'Failed'], default: 'Received' },
  receivedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('IncomingEmail', incomingEmailSchema);
