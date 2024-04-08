const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

router.post("/createAvailability/:doctorId", availabilityController.createAvailability);
router.get('/:doctorId/:dayOfWeek', availabilityController.getDoctorAvailabilityByDay);
router.put('/editNormalDays/:availabilityId', availabilityController.editNormalDays);
router.put('/editSaturday/:availabilityId', availabilityController.editSaturday);
router.put('/editSunday/:availabilityId', availabilityController.editSunday);

module.exports = router;
