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
        remarks: [
          {
            remark: String,
            date: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    },
  },
);

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);