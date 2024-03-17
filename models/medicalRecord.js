const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicalHistory: String,
  allergies: [String],
  currentMedications: [String],
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
