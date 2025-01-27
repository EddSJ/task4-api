const { Pool, Client } = require('pg');
require('dotenv').config();

const createDatabase = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();
    await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    console.log('Database created successfully');
  } catch (error) {
    if (error.code === '42P04') {
      console.log('Database already exists');
    } else {
      console.error('Error creating database:', error);
    }
  } finally {
    await client.end();
  }
};

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

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
  `;

  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    client.release();
    console.log('Users table created successfully');
  } catch (error) {
    console.error('Error creating users table:', error);
  }
};

const createUniqueIndex = async () => {
  const query = `
    CREATE UNIQUE INDEX IF NOT EXISTS unique_email_idx ON users(email);
  `;

  try {
    const client = await pool.connect();
    await client.query(query);
    client.release();
    console.log('Unique index on email created successfully');
  } catch (error) {
    console.error('Error creating unique index:', error);
  }
};

const setupDatabase = async () => {
  await createDatabase();
  await createUsersTable();
  await createUniqueIndex();
};

setupDatabase();

module.exports = pool;