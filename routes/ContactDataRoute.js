// routes/ContactDataRoute.js
const express = require('express')
const ContactData = require('../models/ContactData')

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { fullName, email, message } = req.body

    // Save data to MongoDB
    await ContactData.create({ fullName, email, message })

    console.log('Contact data saved to MongoDB')
    res.status(201).json({ message: 'Contact data saved successfully' })
  } catch (error) {
    console.error('Error saving contact data to MongoDB:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Route to retrieve all contact data
router.get('/', async (req, res) => {
  try {
    const contactData = await ContactData.find()

    res.json(contactData)
  } catch (error) {
    console.error('Error retrieving contact data from MongoDB:', error)
    res.status(500).send('Internal Server Error')
  }
})

module.exports = router
