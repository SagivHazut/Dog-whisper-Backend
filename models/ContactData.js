// models/ContactData.js
const mongoose = require('mongoose')

const contactDataSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
  color: {
    type: String,
    default: generateRandomColor,
  },
})

// Function to generate a random color
function generateRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const ContactData = mongoose.model('ContactData', contactDataSchema)

module.exports = ContactData
