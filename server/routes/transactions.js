const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const authenticateToken = require('../middleware/auth')

// Apply auth middleware to ALL routes in this file
// Every route below requires a valid JWT token
router.use(authenticateToken)

// ─── ADD TRANSACTION ─────────────────────────────────────
// POST /api/transactions
router.post('/', async (req, res) => {
  try {
    const { type, category, amount, description, date } = req.body
    // req.user.userId comes from the JWT middleware
    const userId = req.user.userId

    // Validate required fields
    if (!type || !category || !amount) {
      return res.status(400).json({ message: 'Type, category and amount are required' })
    }

    const newTransaction = await pool.query(
      `INSERT INTO transactions (user_id, type, category, amount, description, date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, type, category, amount, description, date || new Date()]
    )

    res.status(201).json(newTransaction.rows[0])

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// ─── GET ALL TRANSACTIONS ────────────────────────────────
// GET /api/transactions
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId

    const transactions = await pool.query(
      `SELECT * FROM transactions
       WHERE user_id = $1
       ORDER BY date DESC, created_at DESC`,
      [userId]
    )

    res.json(transactions.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// ─── GET SUMMARY ─────────────────────────────────────────
// GET /api/transactions/summary
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user.userId

    const result = await pool.query(
      `SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) AS balance
       FROM transactions
       WHERE user_id = $1`,
      [userId]
    )

    res.json(result.rows[0])

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// ─── DELETE TRANSACTION ──────────────────────────────────
// DELETE /api/transactions/:id
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.userId
    const { id } = req.params

    // Make sure the transaction belongs to this user
    // Never let a user delete someone else's transaction
    const transaction = await pool.query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [id, userId]
    )

    if (transaction.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    await pool.query('DELETE FROM transactions WHERE id = $1', [id])

    res.json({ message: 'Transaction deleted' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router