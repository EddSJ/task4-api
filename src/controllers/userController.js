const UserModel = require('../models/User')

class UserController {
  static async getAllUsers (req, res) {
    try {
      const users = await UserModel.getAllUsers()
      res.json(users)
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve users', error: error.message })
    }
  }

  static async blockUsers (req, res) {
    try {
      const { userIds } = req.body
      await UserModel.updateUserStatus(userIds, 'blocked')
      res.json({ message: 'Users blocked successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Failed to block users', error: error.message })
    }
  }

  static async unblockUsers (req, res) {
    try {
      const { userIds } = req.body
      await UserModel.updateUserStatus(userIds, 'active')
      res.json({ message: 'Users unblocked successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Failed to unblock users', error: error.message })
    }
  }

  static async deleteUsers (req, res) {
    try {
      const { userIds } = req.body
      await UserModel.deleteUsers(userIds)
      res.json({ message: 'Users deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete users', error: error.message })
    }
  }
}

module.exports = UserController
