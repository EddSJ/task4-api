const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
})

// Create users table with unique index on email
const createUsersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      status VARCHAR(20) DEFAULT 'active',
      last_login TIMESTAMP,
      registration_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create unique index on email
    CREATE UNIQUE INDEX IF NOT EXISTS unique_email_idx ON users(email);
  `

  try {
    const client = await pool.connect()
    await client.query(createTableQuery)
    client.release()
    console.log('Users table created successfully')
  } catch (error) {
    console.error('Error creating users table:', error)
  }
}

createUsersTable()

module.exports = pool
