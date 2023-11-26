// routes/ContactDataRoute.js
const express = require('express')
const ContactData = require('../models/ContactData')

const router = express.Router()

//post a user review
router.post('/', async (req, res) => {
  try {
    const { fullName, email, message } = req.body
    await ContactData.create({ fullName, email, message })
    console.log('Contact data saved to MongoDB')
    res.status(201).json({ message: 'Contact data saved successfully' })
  } catch (error) {
    console.error('Error saving contact data to MongoDB:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Route to retrieve all reviews data
router.get('/', async (req, res) => {
  try {
    const contactData = await ContactData.find()

    res.json(contactData)
  } catch (error) {
    console.error('Error retrieving contact data from MongoDB:', error)
    res.status(500).send('Internal Server Error')
  }
})

// DELETE a review by ID
router.delete('/:id', async (req, res) => {
  const reviewId = req.params.id
  try {
    const deletedReview = await ContactData.findByIdAndDelete(reviewId)
    if (deletedReview) {
      res.json({ message: 'Review deleted successfully' })
    } else {
      res.status(404).json({ message: 'Review not found' })
    }
  } catch (error) {
    console.error('Error deleting contact data from MongoDB:', error)
    res.status(500).send('Internal Server Error')
  }
})
module.exports = router
