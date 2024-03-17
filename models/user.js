const mongoose=require("mongoose")
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, enum: ['patient', 'doctor', 'admin'] }
});

module.exports = mongoose.model('User', userSchema);
