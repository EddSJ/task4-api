const jwt = require('jsonwebtoken')
const UserModel = require('../models/User')

const authMiddleware = async (req, res, next) => {
  // Log request details for debugging
  console.log('Request Path:', req.path)
  console.log('Request Method:', req.method)
  
  // Define public routes that don't require authentication
  const publicRoutes = [
    { path: '/auth/login', method: 'POST' },
    { path: '/auth/register', method: 'POST' }
  ]
  
  // Check if the current route is a public route
  const isPublicRoute = publicRoutes.some(
    route => req.path === route.path && req.method === route.method
  )  

  // Log route matching result
  console.log('Is Public Route:', isPublicRoute)
  
  // If it's a public route, continue without authentication
  if (isPublicRoute) {
    console.log("Entering public route")
    return next()
  }

  // Log authorization header
  console.log('Authorization Header:', req.headers.authorization)

  // Check for authorization header
  const authHeader = req.headers.authorization
  if (!authHeader) {
    console.log('No authorization header')
    return res.status(401).json({ message: 'No token provided' })
  }

  // Extract token from Authorization header
  const token = authHeader.split(' ')[1]
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret')

    // Find user by email from decoded token
    const user = await UserModel.findByEmail(decoded.email)
    
    // Check if user exists and is not blocked
    if (!user) {
      return res.status(403).json({ message: 'User not found' })
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Account is blocked' })
    }

    // Attach user to request object
    req.user = user
    
    // Continue to the next middleware or route handler
    next()
  } catch (error) {
    // Handle token verification errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }
    
    res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = authMiddleware