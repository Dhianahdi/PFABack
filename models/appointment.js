const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dateTime: Date,
});

module.exports = mongoose.model('Appointment', appointmentSchema);
