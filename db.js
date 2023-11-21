// db.js
require('dotenv').config()
const mongoose = require('mongoose')

const uri = process.env.MONGODB_URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error)
})

db.once('open', () => {
  console.log('Connected to MongoDB')
})

module.exports = mongoose
