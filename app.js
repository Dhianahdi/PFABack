const express = require('express')
const app = express()

const http = require('http')
const port = process.env.PORT || 5000

const server = http.createServer(app)
const { io } = require('./socket/socketServer')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const availabilityRoutes = require('./routes/availability')
const appointmentRoutes = require('./routes/appointment')
const notificationRoutes = require('./routes/notification')
const EmailVerificationRoutes = require("./routes/EmailVerification");

server.listen(port, () => {
  console.log('Listening on ' + port)
})

io.listen(8000)

mongoose
  .connect('mongodb+srv://monginahdi:123@cluster0.v0sfiro.mongodb.net/PFA')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((e) => console.log('Connexion à MongoDB échouée !', e))

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  )
  next()
})
app.post('/api/upload', (req, res) => {
  const imageFile = req.files.image;

  // Get the filename from the request
  const filename = req.files.image.name;

  // Save the image to the assets/img/ directory
  imageFile.mv(`./img/${filename}`, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ filename });
  });
});

app.use('/api/user', userRoutes)
app.use('/api/availability', availabilityRoutes)
app.use('/api/appointment', appointmentRoutes)
app.use('/api/notification', notificationRoutes)
app.use("/api/EmailVerification", EmailVerificationRoutes);

module.exports = app
