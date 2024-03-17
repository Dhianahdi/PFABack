const express = require('express');
const app = express();
const mongoose  = require('mongoose');
const choristeRoutes= require ("./routes/choriste")
const oeuvreRoutes= require ("./routes/oeuvre")

mongoose.connect('mongodb://127.0.0.1:27017/DsNode')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((e) => console.log('Connexion à MongoDB échouée !',e));

  
app.use(express.json());



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


  app.use("/api/choriste", choristeRoutes)
  app.use("/api/oeuvre", oeuvreRoutes)




module.exports = app;