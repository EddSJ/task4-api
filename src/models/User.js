const pool = require('../config/database')
const bcrypt = require('bcryptjs')

class UserModel {
  static async create (user) {
    const { name, email, password } = user
    const hashedPassword = await bcrypt.hash(password, 10)

    const query = `
      INSERT INTO users (name, email, password) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `

    try {
      const result = await pool.query(query, [name, email, hashedPassword])
      return result.rows[0]
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Email already exists')
      }
      throw error
    }
  }

  static async findByEmail (email) {
    const query = 'SELECT * FROM users WHERE email = $1'
    const result = await pool.query(query, [email])
    return result.rows[0] || null
  }

  static async updateLastLogin (userId) {
    const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1'
    await pool.query(query, [userId])
  }

  static async getAllUsers () {
    const query = `
      SELECT id, name, email, status, last_login, registration_time 
      FROM users 
      ORDER BY last_login DESC NULLS LAST
    `
    const result = await pool.query(query)
    return result.rows
  }

  static async updateUserStatus (userIds, status) {
    const query = 'UPDATE users SET status = $1 WHERE id = ANY($2)'
    await pool.query(query, [status, userIds])
  }

  static async deleteUsers (userIds) {
    const query = 'DELETE FROM users WHERE id = ANY($1)'
    await pool.query(query, [userIds])
  }
}

module.exports = UserModel
