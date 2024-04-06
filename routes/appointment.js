const express = require('express')
const router = express.Router()
const appointmentController = require('../controllers/appointmentController')

router.post('/', appointmentController.createAppointment)
router.post('/addAppointment', appointmentController.addAppointment)
router.get('/', appointmentController.getAllAppointments)
router.get('/:id', appointmentController.getAppointmentById)
router.get('/getReservedAppointments/:doctorId/:date', appointmentController.getAppointmentsByDateAndDoctor)
router.get(
  '/getAppointmentsByUserEmail/:email',
  appointmentController.getAppointmentsByUserEmail,
)
router.put('/:id', appointmentController.updateAppointment)
router.delete('/:id', appointmentController.deleteAppointment)

module.exports = router
