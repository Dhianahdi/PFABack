const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const oeuvreSchema = new Schema({
 
 
  titre: {
    type: String,
    required: true,
  },


  membres:[
    {
      type: Schema.Types.ObjectId,
      ref: 'choriste',
      required: true
    }
  ],

});

const oeuvre = mongoose.model('oeuvre', oeuvreSchema);

module.exports = oeuvre;