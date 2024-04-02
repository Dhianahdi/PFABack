const Availability = require('../models/availability');
const User=require("../models/user");
exports.createAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const availabilityData = req.body;

    const newAvailability = new Availability(availabilityData);

    doctor.availability = newAvailability._id;

    await Promise.all([doctor.save(), newAvailability.save()]);

    res.status(201).json(newAvailability);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.getDoctorAvailabilityByDay = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const dayOfWeek = req.params.dayOfWeek;
    const availability = await Availability.find({ doctor: doctorId, dayOfWeek: dayOfWeek });
    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
