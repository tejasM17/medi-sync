const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  phone: String,
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
