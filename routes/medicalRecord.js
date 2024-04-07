const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');

router.get('/:patientId', medicalRecordController.getMedicalRecordByPatientId);
router.post('/add-remark/:patientId', medicalRecordController.createMedicalRecord);
router.put("/:patientId/update-remark",medicalRecordController.updateRemark);

module.exports = router;