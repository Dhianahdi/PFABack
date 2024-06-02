const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');

router.get('/patient-history/:patientId', medicalRecordController.getMedicalRecordByPatientId);
router.post('/add-remark/:patientId', medicalRecordController.createMedicalRecord);
router.put("/update-remark/:patientId", medicalRecordController.updateRemark);
router.get("/doctor-remarks/:doctorId", medicalRecordController.getRemarksByDoctor);
router.get("/doctor-patients/:doctorId", medicalRecordController.getpatientsByDoctor);


module.exports = router;