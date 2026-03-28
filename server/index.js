const express = require('express')
const cors = require('cors')
require('dotenv').config()
const pool = require('./config/db')

// Import routes
const authRoutes = require('./routes/auth')
const transactionRoutes = require('./routes/transactions')

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://budget-tracker-zay.vercel.app'
  ]
}))
app.use(express.json())

// Mount routes
app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})