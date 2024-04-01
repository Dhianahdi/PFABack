const Appointment = require('../models/appointment')
const cron = require('node-cron')
const { onlineUsers, io } = require('../socket/socketServer')
// const sendNotification = require("../utils/SendNotification");
const {
  sendNotification,
  addNotification,
} = require('./notificationcontroller')

const User = require('../models/user')




exports.addAppointment = async (req, res) => {
  try {
    const patientEmail = req.body.patientEmail
    const patient = await User.findOne({ email: patientEmail })
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' })
    }

    const newAppointment = new Appointment({
      user: patient._id,
      doctor: req.body.doctorId,
      dateTime: req.body.dateTime,
    })

    // Enregistrer le rendez-vous dans la base de données
    await newAppointment.save()

    res.status(201).json({
      message: 'Appointment added successfully.',
      appointment: newAppointment,
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
exports.createAppointment = async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body)
    await newAppointment.save()
    res.status(201).json(newAppointment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
    res.json(appointments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé.' })
    }
    res.json(appointment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    )
    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé.' })
    }
    res.json(updatedAppointment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id)
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé.' })
    }
    res.json({ message: 'Rendez-vous supprimé avec succès.' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

cron.schedule('0 0 * * *', async () => {
  try {
    const currentTime = new Date()
    const next24Hours = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000)

    const appointmentsWithin24Hours = await Appointment.find({
      dateTime: { $gte: currentTime, $lt: next24Hours },
    })
      .populate('user')
      .populate('doctor')
    if (appointmentsWithin24Hours.length > 0) {
      for (const appointment of appointmentsWithin24Hours) {
        const patient = appointment.user
        const existingUser = onlineUsers.find(
          (user) => user.userId === patient._id.toString(),
        )
        if (existingUser) {
          const req = {
            notificationdetails: {
              userSocketId: existingUser.socketId,
              notif_body: `RAPPEL : un rendez-vous est programmé pour aujourd'hui le ${new Date(
                appointment.dateTime,
              ).toLocaleDateString()},
              à ${new Date(
                appointment.dateTime,
              ).toLocaleTimeString()} avec Dr ${appointment.doctor.email}`,
            },
          }

          await sendNotification(req, null, async () => {
            res
              .status(200)
              .json({ message: 'Utilisateurs récupérés avec succès' })
          })
        }
        const data = {
          body: {
            userId: patient._id.toString(),
            newMessage: `RAPPEL : un rendez-vous est programmé pour aujourd'hui le ${new Date(
              appointment.dateTime,
            ).toLocaleDateString()},
              à ${new Date(
                appointment.dateTime,
              ).toLocaleTimeString()} avec Dr ${appointment.doctor.email}`,
          },
        }

        await addNotification(data, null, async () => {
          res
            .status(200)
            .json({ message: 'Utilisateurs récupérés avec succès' })
        })
      }
    }
  } catch (error) {
    console.error(
      'Erreur lors de la vérification des rendez-vous dans les 24 prochaines heures :',
      error,
    )
  }
})
exports.getAppointmentsByUserEmail = async (req, res) => {
  try {
    const userEmail = req.params.email

    const user = await User.findOne({ email: userEmail })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const appointments = await Appointment.find({ user: user._id }).populate(
      'doctor',
    )
    res.json(appointments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
