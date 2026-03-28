const jwt = require('jsonwebtoken')

// This function runs BEFORE protected route handlers
// It checks if the request has a valid JWT token
const authenticateToken = (req, res, next) => {
  // Token comes in the header like: "Bearer eyJhbG..."
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  // No token = not logged in
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token.' })
  }

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // Attach the user data to the request object
    req.user = decoded
    // Move on to the actual route handler
    next()
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' })
  }
}

module.exports = authenticateToken