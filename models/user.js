const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    sexe: { type: String, enum: ["Male", "Female"] },
    date_naissance: { type: Date },
    image: { type: String, default: "user.png" },
    telephone: {
      type: String,
      required: function () {
        return this.role === "doctor";
      },
    },
    telephone_2: { type: String },
    telephone_3: { type: String },
    gouvernorat: {
      type: String,
      // required: function () {
      //   return this.role === "doctor";
      // },
    },
    avenue: {
      type: String,
      // required: function () {
      //   return this.role === "doctor";
      // },
    },
    code_postal: {
      type: String,
      // required: function () {
      //   return this.role === "doctor";
      // },
    },
    Specialty: {
      type: Schema.Types.ObjectId,
      ref: "Specialty",
      required: function () {
        return this.role === "doctor";
      },
    },
    availability: { type: Schema.Types.ObjectId, ref: "Availability" },

    geolocalisation: {
      type: {
        longitude: {
          type: Number,
        },
        latitude: {
          type: Number,
        },
      },
    },
    username: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    token: { type: String },
    isVerified: {
      type: Boolean,
      default: false,
    },
    password: { type: String, required: true },
    newPasswordCode: { type: String, unique: true, default: null },
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
