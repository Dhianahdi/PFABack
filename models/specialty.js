const mongoose = require('mongoose');

const specialtySchema = new mongoose.Schema({
  name: String,
  description: String,
});

module.exports = mongoose.model('Specialty', specialtySchema);