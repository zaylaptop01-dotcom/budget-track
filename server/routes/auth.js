const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')

// ─── REGISTER ───────────────────────────────────────────
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    // 1. Get data from request body
    const { name, email, password } = req.body

    // 2. Check if user already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // 3. Hash the password — never store plain text
    // 10 is the "salt rounds" — how many times to scramble
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Save the new user to database
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    )

    // 5. Create a JWT token
    const token = jwt.sign(
      { userId: newUser.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 6. Send back the token and user info
    res.status(201).json({
      token,
      user: newUser.rows[0]
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// ─── LOGIN ──────────────────────────────────────────────
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    // 1. Get data from request body
    const { email, password } = req.body

    // 2. Find user in database
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const user = result.rows[0]

    // 3. Compare password with stored hash
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // 4. Create JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 5. Send back token and user info (never send password)
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router