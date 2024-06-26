const mongoose = require('mongoose');

const specialtySchema = new mongoose.Schema(
  {
    name: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Specialty', specialtySchema);