const User = require('../models/user')
const user = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Specialty = require('../models/specialty')
const Review = require('../models/review')

exports.getDoctorsInfo = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })

    for (const doctor of doctors) {
      doctor.specialties = await Specialty.find({
        _id: { $in: doctor.specialties },
      })
    }

    for (const doctor of doctors) {
      doctor.reviews = await Review.find({ doctorId: doctor._id })
    }

    res.json(doctors)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
exports.getDoctorDetails = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('specialties', 'name')
      .populate('qualifications', 'degree institution')
      .populate('reviews', 'rating comment')
    if (!doctor) {
      return res.status(404).json({ message: 'Médecin non trouvé.' })
    }
    res.json(doctor)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        nom: req.body.nom,
        prenom: req.body.prenom,
        sexe: req.body.sexe,
        date_naissance: req.body.date_naissance,
        telephone: req.body.telephone,
        telephone_2: req.body.telephone_2,
        telephone_3: req.body.telephone_3,
        gouvernorat: req.body.gouvernorat,
        avenue: req.body.avenue,
        code_postal: req.body.code_postal,
        username: req.body.username,
        email: req.body.email,
        password: hash,
        role: req.body.role,
      })
      user
        .save()
        .then((response) => {
          const newUser = response.toObject()
          delete newUser.password
          res.status(201).json({
            user: newUser,
            message: 'user created !',
          })
        })
        .catch((error) => res.status(400).json({ error: error.message }))
    })
    .catch((error) => res.status(500).json({ error }))
}

exports.login = async (req, res, next) => {
  try {
    const { email, password, longitude, latitude } = req.body
console.log(req.body)
    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Login ou mot de passe incorrect' })
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: 'Login ou mot de passe incorrect' })
    }

    // If longitude and latitude are provided, update user's location
    if (longitude !== undefined && latitude !== undefined) {
      user.geolocalisation = {
        longitude,
        latitude
      };
      console.log(user)

      await user.save()
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, userType: user.type },
      'RANDOM TOKEN', // Replace with your secret key
      { expiresIn: '24h' },
    )

    // Send token in response
    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.createUser = async (req, res) => {
  try {
    const userData = req.body

    const hashedPassword = await bcrypt.hash(userData.password, 10)

    userData.password = hashedPassword

    const newUser = new User(userData)

    await newUser.save()

    res.status(201).json({
      _id: newUser._id,
      nom: newUser.nom,
      prenom: newUser.prenom,
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate('Specialty')
      .populate('availability')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('Specialty')
      .populate('availability')

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' })
    }
    res.json(updatedUser)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' })
    }
    res.json({ message: 'Utilisateur supprimé avec succès.' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).populate('Specialty')
    res.json(doctors)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getUserByEmail = async (req, res) => {
  try {
    const userEmail = req.params.email
    const user = await User.findOne({ email: userEmail }).populate('Specialty')
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }

  exports.addGeolocation = async (req, res) => {
    try {
      const { userId, longitude, latitude } = req.body

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' })
      }

      user.geolocalisation = {
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
      }

      await user.save()

      res.status(200).json({ message: 'Géolocalisation ajoutée avec succès.' })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}
