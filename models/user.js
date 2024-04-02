const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
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

    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    token: { type: String, required: true },
    isVerified: {
      type: Boolean,
      default: false,
    },
    password: { type: String, required: true },
    newPasswordCode: { type: String, unique : true, default: null },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
