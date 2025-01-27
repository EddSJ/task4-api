const bcrypt = require('bcryptjs')
const UserModel = require('../models/User')
const jwtUtils = require('../config/jwt')

class AuthController {
  static async register (req, res) {
    try {
      const { name, email, password } = req.body

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email)
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' })
      }

      // Create new user
      const user = await UserModel.create({ name, email, password })

      res.status(201).json({
        message: 'User registered successfully',
        userId: user.id
      })
    } catch (error) {
      res.status(500).json({ message: 'Registration failed', error: error.message })
    }
  }

  static async login (req, res) {
    try {
      const { email, password } = req.body

      // Find user
      const user = await UserModel.findByEmail(email)
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      // Check if user is blocked
      if (user.status === 'blocked') {
        return res.status(403).json({ message: 'Account is blocked' })
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      // Update last login
      await UserModel.updateLastLogin(user.id)

      // Generate JWT using utility function
      const token = jwtUtils.generateToken({ 
        userId: user.id, 
        email: user.email 
      })

      res.json({
        token,
        userId: user.id,
        name: user.name,
        email: user.email
      })
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: error.message })
    }
  }
}

module.exports = AuthController