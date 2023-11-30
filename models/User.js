const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  color: { type: String, required: true },
  admin: { type: Boolean },
  customer: { type: Boolean },
  token: { type: String },
  trainingDays: [
    {
      day: { type: String },
      hour: { type: Number },
      activity: { type: String },
      date: { type: String },
    },
  ],
  previousTrainings: [
    {
      day: { type: String },
      hour: { type: Number },
      activity: { type: String },
      date: { type: String },
    },
  ],

  lastReset: { type: Date },
})

const User = mongoose.model('User', userSchema)

module.exports = User
