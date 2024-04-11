const MedicalRecord = require("../models/medicalRecord");
const User = require("../models/user");

exports.createMedicalRecord = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const { doctorId, remark } = req.body;

    // Recherche du dossier médical du patient
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
      // Ajouter la première remarque avec la date d'ajout
      medicalRecord.medicalHistory.set(doctorId, {
        remarks: [{ remark, date: Date.now() }],
      });
    } else {
      // Ajouter la remarque avec la date d'ajout
      medicalRecord.medicalHistory.get(doctorId).remarks.push({
        remark,
        date: Date.now(),
      });
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
    doctorRecord.remarks[remarkIndex].remark = newRemark;
    doctorRecord.remarks[remarkIndex].dateModified = Date.now();

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

    // Préparer les données à renvoyer
    let medicalData = [];

    // Parcourir chaque entrée médicale dans le dossier médical
    for (const [
      doctorId,
      doctorRecord,
    ] of medicalRecord.medicalHistory.entries()) {
      // Récupérer le nom du médecin à partir de l'ID
      const doctor = await User.findById(doctorId);
      if (!doctor) {
        console.error("Doctor not found with ID:", doctorId);
        continue; // Passez à l'entrée suivante s'il n'y a pas de médecin correspondant
      }

      // Pour chaque remarque, ajouter le nom du médecin
      const remarksWithDoctorName = doctorRecord.remarks.map((remark) => ({
        remark: remark.remark,
        date: remark.date,
        doctorName: `${doctor.nom} ${doctor.prenom}`,
      }));

      // Ajouter les remarques au tableau de données médicales
      medicalData = [...medicalData, ...remarksWithDoctorName];
    }

    // Trier les remarques par date
    medicalData.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({ medicalData });
  } catch (error) {
    console.error("Error getting medical record:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



exports.getRemarksByDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    // Recherche de toutes les entrées médicales associées au médecin spécifique
    const medicalRecords = await MedicalRecord.find({
     
      [`medicalHistory.${doctorId}`]: { $exists: true },
    }).populate("patient");
 //console.log('medicalRecords: ', medicalRecords);
    // Initialiser un objet pour stocker les remarques groupées par patient
    const remarksByPatient = {};

    // Parcourir chaque entrée médicale
    medicalRecords.forEach((medicalRecord) => {
      // Récupérer le nom et le prénom du patient
      const patientName = medicalRecord.patient.nom;
      const patientSurname = medicalRecord.patient.prenom;


      // Récupérer les remarques associées au médecin spécifique
      const doctorRecord = medicalRecord.medicalHistory.get(doctorId);
     // console.log('doctorRecord: ', doctorRecord);
      if (!doctorRecord) {
        return; // Si aucune remarque associée au médecin, passer à l'entrée suivante
      }

      // Vérifier si le patient existe dans le groupe
      if (!remarksByPatient[medicalRecord.patient._id]) {
        remarksByPatient[medicalRecord.patient._id] = {
          patientName,
          patientSurname,
          remarks: [],
        };
      }

      // Ajouter les remarques du patient
      doctorRecord.remarks.forEach((remark) => {
        remarksByPatient[medicalRecord.patient._id].remarks.push({
          remark: remark.remark,
          date: remark.date,
        });
      });
    });

   // console.log("remarksByPatient: ", remarksByPatient);
    

    // Trier les remarques de chaque patient par date
    for (const patientId in remarksByPatient) {
      remarksByPatient[patientId].remarks.sort(
        
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    }
//console.log('remarksByPatient: ', remarksByPatient);
    res.status(200).json({ remarksByPatient });
  } catch (error) {
    console.error("Error getting remarks by doctor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



