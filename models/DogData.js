const mongoose = require('mongoose')

const dogDataSchema = new mongoose.Schema({
  apiName: String,
  data: Object,
})

const DogData = mongoose.model('DogData', dogDataSchema)

module.exports = DogData
