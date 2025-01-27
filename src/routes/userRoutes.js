const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Get all users
router.get('/', UserController.getAllUsers);

// Block users
router.post('/block', UserController.blockUsers);

// Unblock users
router.post('/unblock', UserController.unblockUsers);

// Delete users
router.post('/delete', UserController.deleteUsers);

module.exports = router;