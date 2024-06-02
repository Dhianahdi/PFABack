// questionController.js
const Question = require('../models/question')
const User = require('../models/user')
// Créer une question
exports.createQuestion = async (req, res) => {
  try {
    const newQuestion = new Question(req.body)
    await newQuestion.save()
    res.status(201).json(newQuestion)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Obtenir toutes les questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
    res.json(questions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Obtenir une question par ID
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
    if (!question) {
      return res.status(404).json({ message: 'Question non trouvée.' })
    }
    res.json(question)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Mettre à jour une question
exports.updateQuestion = async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    )
    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question non trouvée.' })
    }
    res.json(updatedQuestion)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Supprimer une question
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id)
    if (!question) {
      return res.status(404).json({ message: 'Question non trouvée.' })
    }
    res.json({ message: 'Question supprimée avec succès.' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

async function getUserByEmail(email) {
  return await User.findOne({ email })
}

// Assuming you have a function to get doctor by email
async function getDoctorByEmail(email) {
  return await User.findOne({ email })
}

exports.addQuestion = async (req, res) => {
  const { userEmail, doctorEmail, questionText } = req.body
  console.log(req.body)
  try {
    const user = await getUserByEmail(userEmail)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const doctor = await getDoctorByEmail(doctorEmail)
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }

    // Create new question
    const newQuestion = new Question({
      userId: user._id,
      doctorId: doctor._id,
      questionText,
    })

    // Save the question
    await newQuestion.save()

    return res.status(201).json({ message: 'Question added successfully' })
  } catch (error) {
    console.error('Error adding question:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// Get questions by doctor email
exports.getQuestionsByDoctorEmail = async (req, res) => {
  const { doctorEmail } = req.params

  try {
    // Find the doctor by email
    const doctor = await User.findOne({ email: doctorEmail })
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }

    // Find questions with the doctor's ID
    const questions = await Question.find({ doctorId: doctor._id }).populate(
      'userId',
    )
    console.log(questions)

    res.json(questions)
  } catch (error) {
    console.error('Error retrieving questions by doctor email:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get questions by user email
exports.getQuestionsByUserEmail = async (req, res) => {
  const { userEmail } = req.params

  try {
    // Find the user by email
    const user = await User.findOne({ email: userEmail })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Find questions with the user's ID
    const questions = await Question.find({ userId: user._id })
    res.json(questions)
  } catch (error) {
    console.error('Error retrieving questions by user email:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
