const mongoose = require('mongoose')

// ympäristömuuttujien käyttöönotto
if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url)

const Reminder = mongoose.model('Reminder', {
    name: String,
    timestamp: Date
  })

module.exports = Reminder   // mikä osa moduulista näkyy ulospäin


