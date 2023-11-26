const express = require('express')
const mongoose = require('./db')
const cors = require('cors')
const DogData = require('./models/DogData')
const { HomepageDogImages, fetchDogsBreeds } = require('./routes/dogsApis')
const usersRoute = require('./routes/users')
const ContactDataRoute = require('./routes/ContactDataRoute')

const app = express()
const port = process.env.PORT || 8080

app.use(express.json())
app.use(cors())

const saveDataToDatabase = async () => {
  try {
    const dogsImagesData = await fetchDogsBreeds()
    const homepageDogImagesData = await HomepageDogImages()

    // Save data to MongoDB
    await DogData.create({ apiName: 'dogsImages', data: dogsImagesData })
    await DogData.create({
      apiName: 'homepageDogImages',
      data: homepageDogImagesData,
    })

    console.log('Data saved to MongoDB')
  } catch (error) {
    console.error('Error saving data to MongoDB:', error)
  }
}

// users route from the imported users
app.use('/api', usersRoute)

// Endpoint to retrieve data from MongoDB
app.get('/api/data/:apiName', async (req, res) => {
  const { apiName } = req.params

  try {
    const data = await DogData.findOne({ apiName })

    if (data) {
      res.json(data)
    } else {
      res.status(404).json({ message: 'Data not found' })
    }
  } catch (error) {
    console.error('Error retrieving data from MongoDB:', error)
    res.status(500).send('Internal Server Error')
  }
})

app.use('/api/contact', ContactDataRoute)

// Start the server and save data to MongoDB when it starts
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`)
  await saveDataToDatabase()
})
