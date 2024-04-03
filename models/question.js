const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    questionText: String,
    responseText: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);
