const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');

router.get('/:patientId', medicalRecordController.getMedicalRecordByPatientId);
router.post('/', medicalRecordController.createMedicalRecord);

router.get('/', medicalRecordController.getAllMedicalRecords);


router.put('/:patientId', medicalRecordController.updateMedicalRecord);

router.delete('/:patientId', medicalRecordController.deleteMedicalRecord);

module.exports = router;
module.exports = router;