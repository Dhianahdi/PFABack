const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');

router.get('/:patientId', medicalRecordController.getMedicalRecordByPatientId);
router.post('/add-remark/:patientId', medicalRecordController.createMedicalRecord);
router.put("/update-remark/:patientId", medicalRecordController.updateRemark);

module.exports = router;