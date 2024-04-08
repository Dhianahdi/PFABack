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


exports.updateDoctorAvailabilityByDay = async (req, res) => {
  try {
    const { doctorId, dayOfWeek } = req.params;
    const updatedAvailabilityData = req.body;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const availability = await Availability.findOne({ doctor: doctorId, dayOfWeek: dayOfWeek });
    if (!availability) {
      return res.status(404).json({ message: "Availability not found for the specified day" });
    }

    // Update availability fields with the new data
    availability.isAvailable = updatedAvailabilityData.isAvailable;
    availability.startTime = updatedAvailabilityData.startTime;
    availability.endTime = updatedAvailabilityData.endTime;

    await availability.save();

    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.editNormalDays = async (req, res) => {
  try {
    const { availabilityId } = req.params;
    const {  startTime, endTime } = req.body;

    const availability = await Availability.findByIdAndUpdate(
      availabilityId,
      { $set: { 'normalDays.isAvailable': true, 'normalDays.startTime': startTime, 'normalDays.endTime': endTime } },
      { new: true }
    );

    res.status(200).json(availability);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fonction pour éditer la disponibilité du dimanche (sunday)
exports.editSunday = async (req, res) => {
  try {
    const { availabilityId } = req.params;
    const { isAvailable, startTime, endTime } = req.body;

    const availability = await Availability.findByIdAndUpdate(
      availabilityId,
      { $set: { 'sunday.isAvailable': isAvailable, 'sunday.startTime': startTime, 'sunday.endTime': endTime } },
      { new: true }
    );

    res.status(200).json(availability);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fonction pour éditer la disponibilité du samedi (saturday)
exports.editSaturday = async (req, res) => {
  try {
    const { availabilityId } = req.params;
    const { isAvailable, startTime, endTime } = req.body;

    const availability = await Availability.findByIdAndUpdate(
      availabilityId,
      { $set: { 'saturday.isAvailable': isAvailable, 'saturday.startTime': startTime, 'saturday.endTime': endTime } },
      { new: true }
    );

    res.status(200).json(availability);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
