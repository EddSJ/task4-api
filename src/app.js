const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')

const authMiddleware = require('./middleware/authMiddleware')

const app = express()

const corsOptions = {
  origin: 'https://task4front-1gqn.onrender.com',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization'
};

app.use(cors())
app.options('*', cors(corsOptions));
app.use(express.json())

app.use('/api', authMiddleware)

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
