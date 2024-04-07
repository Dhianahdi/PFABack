const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medicalHistory: {
      type: Map,
      of: {
        remarks: [String],
        date: {
          type: Date,
          default: Date.now,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);