const Availability = require('../models/availability');

exports.createAvailability = async (req, res) => {
  try {
    const newAvailability = new Availability(req.body);
    await newAvailability.save();
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
