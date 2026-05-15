const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,           // Will be hashed later
  role: { type: String, enum: ['Doctor', 'Admin'], default: 'Doctor' },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
