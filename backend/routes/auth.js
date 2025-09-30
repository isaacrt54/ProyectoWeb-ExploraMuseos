const express = require('express');
const router = express.Router();
// Controllers
const {
    registerUser,
    loginUser
} = require('../controllers/authController');

// POST route for user registration
router.post('/register', registerUser);
// POST route for user login
router.post('/login', loginUser);

module.exports = router;
// This code defines the routes for user registration and login in an Express application.
// It imports the necessary modules and the controller functions, and sets up the routes for handling POST requests to '/register' and '/login'.