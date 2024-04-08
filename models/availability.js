const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Availability", availabilitySchema);