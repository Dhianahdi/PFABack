const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  nom: {type: String, required: true },
  prenom: { type: String, required: true },
  sexe: { type: String, enum: ["Male", "Female"] },
  date_naissance: { type: Date },
  telephone: { type: String },
  telephone_2: { type: String },
  telephone_3: { type: String },
  gouvernorat: {
    type: String,
    required: function () {
      return this.role === "doctor";
    },
  },
  avenue: {
    type: String,
    required: function () {
      return this.role === "doctor";
    },
  },
  code_postal: {
    type: String,
    required: function () {
      return this.role === "doctor";
    },
  },

  username: String,
  email: String,
  password: String,
  role: { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
});

module.exports = mongoose.model("User", userSchema);
