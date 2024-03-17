const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dayOfWeek: { type: Number, required: true }, 
  startTime: { type: String, required: true }, 
  endTime: { type: String, required: true } 
});

module.exports = mongoose.model('Availability', availabilitySchema);