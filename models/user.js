const mongoose=require("mongoose")
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  // nom: {type: String, required: true },
  // prenom: { type: String, required: true },
  // sexe: { type: String, enum: ["Male", "Female"] },
  // date_naissance: { type: Date },
  // tel: { type: String },
  username: String,
  email: String,
  password: String,
  role: { type: String, enum: ["patient", "doctor", "admin"] },
});

module.exports = mongoose.model('User', userSchema);
