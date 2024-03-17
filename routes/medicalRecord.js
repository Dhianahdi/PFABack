const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');

router.get('/:patientId', medicalRecordController.getMedicalRecordByPatientId);

module.exports = router;