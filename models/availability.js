const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({

  normalDays: {
    type: {
      isAvailable: { type: Boolean, required: true },
      startTime: {
        type: String,
        required: function () {
          return this.isAvailable;
        },
      },
      endTime: {
        type: String,
        required: function () {
          return this.isAvailable;
        },
      },
    },
    default: { isAvailable: false },
  },

 
  saturday: {
    type: {
      isAvailable: { type: Boolean, required: true },
      startTime: {
        type: String,
        required: function () {
          return this.isAvailable;
        },
      },
      endTime: {
        type: String,
        required: function () {
          return this.isAvailable;
        },
      },
    },
    default: { isAvailable: false },
  },
  sunday: {
    type: {
      isAvailable: { type: Boolean, required: true },
      startTime: {
        type: String,
        required: function () {
          return this.isAvailable;
        },
      },
      endTime: {
        type: String,
        required: function () {
          return this.isAvailable;
        },
      },
    },
    default: { isAvailable: false },
  },
});

module.exports = mongoose.model("Availability", availabilitySchema);