const MedicalRecord = require("../models/medicalRecord");

exports.createMedicalRecord = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const { doctorId, remark } = req.body;

    // Vérifier si le patient a déjà un dossier médical
    let medicalRecord = await MedicalRecord.findOne({ patient: patientId });

    // Si le dossier médical n'existe pas, créer un nouveau dossier
    if (!medicalRecord) {
      medicalRecord = new MedicalRecord({
        patient: patientId,
        medicalHistory: new Map(),
      });
    }

    // Ajouter la remarque à medicalHistory
    if (!medicalRecord.medicalHistory.has(doctorId)) {
      medicalRecord.medicalHistory.set(doctorId, { remarks: [remark] });
    } else {
      medicalRecord.medicalHistory.get(doctorId).remarks.push(remark);
    }

    // Enregistrer les modifications ou le nouveau dossier médical
    await medicalRecord.save();

    res.status(200).json({ message: "Remark added successfully" });
  } catch (error) {
    console.error("Error adding remark:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateRemark = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const { doctorId, remarkIndex, newRemark } = req.body;

    // Recherche du dossier médical du patient
    let medicalRecord = await MedicalRecord.findOne({ patient: patientId });

    if (!medicalRecord) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    // Vérifier si le doctorId existe dans le medicalHistory
    if (!medicalRecord.medicalHistory.has(doctorId)) {
      return res
        .status(404)
        .json({ message: "Doctor not found in medical history" });
    }

    const doctorRecord = medicalRecord.medicalHistory.get(doctorId);

    // Vérifier si l'index de la remarque spécifique est valide
    if (remarkIndex < 0 || remarkIndex >= doctorRecord.remarks.length) {
      return res.status(400).json({ message: "Invalid remark index" });
    }

    // Mettre à jour la remarque et ajouter la date de modification
    doctorRecord.remarks[remarkIndex] = {
      remark: newRemark,
      dateModified: Date.now(),
    };

    // Mettre à jour le medicalHistory dans le dossier médical
    medicalRecord.medicalHistory.set(doctorId, doctorRecord);

    // Enregistrer les modifications
    await medicalRecord.save();

    res.status(200).json({ message: "Remark updated successfully" });
  } catch (error) {
    console.error("Error updating remark:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getMedicalRecordByPatientId = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    // Recherche du dossier médical du patient
    const medicalRecord = await MedicalRecord.findOne({ patient: patientId });

    if (!medicalRecord) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    res.status(200).json({ medicalRecord });
  } catch (error) {
    console.error("Error getting medical record:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
