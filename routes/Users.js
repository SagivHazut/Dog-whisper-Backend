const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const crypto = require('crypto')

// Secret key for signing the token
const secretKey = crypto.randomBytes(32).toString('hex')

// Register a new user
function generateRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with this email already exists' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userColor = generateRandomColor()

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      color: userColor,
      admin: false,
      customer: false,
      trainingDays: [
        {
          day: '',
          hour: 1,
          activity: '',
          date: '',
        },
      ],
      previousTrainings: [],
      lastReset: new Date(),
    })
    const token = jwt.sign({ email: newUser.email }, secretKey, {
      expiresIn: '365d',
    })

    newUser.token = token

    await newUser.save()
    res.status(201).json({ user: newUser, token })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

// Login user and generate JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const userWithToken = { ...user.toObject() }

    res.json(userWithToken)
  } catch (error) {
    console.error('Error logging in:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

// get the user data route
router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({ user })
  } catch (error) {
    console.error('Error getting user data:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

// getting all the users data
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 })

    res.json(users)
  } catch (error) {
    console.error('Error getting all users:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

//updating the user training sceduale
router.put('/update-training-days/:id', async (req, res) => {
  try {
    const { trainingDays } = req.body
    const userId = req.params.id

    await User.updateOne(
      { _id: userId },
      {
        $set: {
          trainingDays,
        },
      }
    )

    res.json({ message: 'Training days updated successfully' })
  } catch (error) {
    console.error('Error updating training days:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

// Route to add new previousTrainings without modifying existing ones
router.post('/update-previous-trainings/:id', async (req, res) => {
  try {
    const { previousTrainings } = req.body
    const userId = req.params.id
    const currentUser = await User.findById(userId)
    const updatedPreviousTrainings = [
      ...currentUser.previousTrainings,
      ...previousTrainings,
    ]

    await User.updateOne(
      { _id: userId },
      {
        $set: {
          previousTrainings: updatedPreviousTrainings,
        },
      }
    )

    res.json({ message: 'Previous trainings updated successfully' })
  } catch (error) {
    console.error('Error updating previous trainings:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

// Update first name
router.put('/update-first-name/:id', async (req, res) => {
  try {
    const { firstName } = req.body
    const userId = req.params.id
    await User.findOneAndUpdate({ _id: userId }, { $set: { firstName } })

    res.json({ message: 'First name updated successfully' })
  } catch (error) {
    console.error('Error updating first name:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

// Update last name
router.put('/update-last-name/:id', async (req, res) => {
  try {
    const { lastName } = req.body
    const userId = req.params.id
    await User.findOneAndUpdate({ _id: userId }, { $set: { lastName } })

    res.json({ message: 'Last name updated successfully' })
  } catch (error) {
    console.error('Error updating last name:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

// Update email
router.put('/updateEmail/:id', async (req, res) => {
  try {
    const { email } = req.body
    const userId = req.params.id
    await User.findOneAndUpdate({ _id: userId }, { $set: { email } })

    res.json({ message: 'Email updated successfully' })
  } catch (error) {
    console.error('Error updating email:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

// changing  the password
router.put('/update-password/:id', async (req, res) => {
  try {
    const { newPassword } = req.body
    const userId = req.params.id
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { password: hashedPassword } }
    )

    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Error updating password:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

module.exports = router
