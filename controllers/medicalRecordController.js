const MedicalRecord = require('../models/medicalRecord');



exports.createMedicalRecord = async (req, res) => {
  try {
    const newMedicalRecord = new MedicalRecord(req.body);
    await newMedicalRecord.save();
    res.status(201).json(newMedicalRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllMedicalRecords = async (req, res) => {
  try {
    const medicalRecords = await MedicalRecord.find();
    res.json(medicalRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMedicalRecordByPatientId = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const medicalRecord = await MedicalRecord.findOne({ patient: patientId });
    if (!medicalRecord) {
      return res.status(404).json({ message: 'Dossier médical non trouvé.' });
    }
    res.json(medicalRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMedicalRecord = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const updatedMedicalRecord = await MedicalRecord.findOneAndUpdate({ patient: patientId }, req.body, { new: true });
    if (!updatedMedicalRecord) {
      return res.status(404).json({ message: 'Dossier médical non trouvé.' });
    }
    res.json(updatedMedicalRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteMedicalRecord = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const deletedMedicalRecord = await MedicalRecord.findOneAndDelete({ patient: patientId });
    if (!deletedMedicalRecord) {
      return res.status(404).json({ message: 'Dossier médical non trouvé.' });
    }
    res.json({ message: 'Dossier médical supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};