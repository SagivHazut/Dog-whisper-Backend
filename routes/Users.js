const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Secret key for signing the token
const secretKey = 'your-secret-key'

// Token expiration time (1 hour in this example)
const expiresIn = '1h'

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, passwordNotHashed } = req.body

    // Check if the user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with this email already exists' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      passwordNotHashed,
    })
    await newUser.save()

    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

// Login user and generate JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find the user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, {
      expiresIn,
    })

    res.json({ token })
  } catch (error) {
    console.error('Error logging in:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

// Protected route to get user data
router.get('/user', authenticateToken, async (req, res) => {
  try {
    // The user data is available in req.user due to middleware
    const user = req.user

    res.json({ user })
  } catch (error) {
    console.error('Error getting user data:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token is not valid' })
    }

    req.user = user
    next()
  })
}

module.exports = router
