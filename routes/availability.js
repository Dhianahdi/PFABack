const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

router.post("/createAvailability/:doctorId", availabilityController.createAvailability);
router.get('/:doctorId/:dayOfWeek', availabilityController.getDoctorAvailabilityByDay);

module.exports = router;
