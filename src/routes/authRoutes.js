const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Registration route
router.post('/register', AuthController.register);

// Login route
router.post('/login', AuthController.login);

module.exports = router;