const User = require("../models/user");
const user = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Specialty = require("../models/specialty");
const Review = require("../models/review");

exports.getDoctorsInfo = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });

    for (const doctor of doctors) {
      doctor.specialties = await Specialty.find({
        _id: { $in: doctor.specialties },
      });
    }

    for (const doctor of doctors) {
      doctor.reviews = await Review.find({ doctorId: doctor._id });
    }

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getDoctorDetails = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("specialties", "name")
      .populate("qualifications", "degree institution")
      .populate("reviews", "rating comment");
    if (!doctor) {
      return res.status(404).json({ message: "Médecin non trouvé." });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        nom: req.body.nom,
        prenom: req.body.prenom,
        sexe: req.body.sexe,
        date_naissance: req.body.date_naissance,
        tel: req.body.tel,
        username: req.body.username,
        email: req.body.email,
        password: hash,
        role: req.body.role,
      });
      user
        .save()
        .then((response) => {
          const newUser = response.toObject();
          delete newUser.password;
          res.status(201).json({
            user: newUser,
            message: "user created !",
          });
        })
        .catch((error) => res.status(400).json({ error: error.message }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  user
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "login ou pass incorrect" });
      }

      bcrypt.compare(req.body.password, user.password).then((valid) => {
        if (!valid) {
          return res.status(401).json({ message: "login ou MP inco" });
        }
        token: jwt.sign(
          { userId: user._id, userType: user.type },
          "RANDOM TOKEN",
          {
            expiresIn: "24h",
          }
        );
        res.status(200).json({
          token: jwt.sign(
            { userId: user._id, userType: user.type },
            "RANDOM TOKEN",
            {
              expiresIn: "24h",
            }
          ),
        });
      });
    })
    .catch((error) => res.status(500).json({ error: error }));
};

exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    res.json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
