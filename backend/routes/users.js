const express = require('express');
const router = express.Router();
// Controllers
const { 
    updateBio,
    updatePassword,
    getUserById,
    getAllUsers,
    updateUserRole,
    deleteUser,
    followMuseum,
    unfollowMuseum,
    getFollowedMuseums
} = require('../controllers/userController');
// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');
const checkAdmin = require('../middlewares/checkAdmin');
// Models
const User = require('../models/User');
const Museum = require('../models/Museum');

// Routes
// Route to update user's biography (only for logged-in users)
router.put(
    '/bio',
    authMiddleware,
    updateBio
);

// Route to update user's password
router.put(
    '/password',
    authMiddleware,
    updatePassword
);

// Route to get user's biography by ID (public route)
router.get(
    '/bio/:userId',
    validateObjectId('userId', User, 'User'),
    getUserById
);

// Route to get all users (only for admin users)
router.get(
    '/admin',
    authMiddleware,
    checkAdmin,
    getAllUsers
);

// Route to update a user's role (only for admin users)
router.put(
    '/admin/:userId',
    authMiddleware,
    checkAdmin,
    validateObjectId('userId', User, 'User'),
    updateUserRole
);

// Route to delete a user account (only for admin users)
router.delete(
    '/delete/:userId',
    authMiddleware,
    checkAdmin,
    validateObjectId('userId', User, 'User'),
    deleteUser
);

// Route to follow a museum (only for logged-in users)
router.post(
    '/followed/:museumId',
    authMiddleware,
    validateObjectId('museumId', Museum, 'Museum'),
    followMuseum
);

// Route to unfollow a museum (only for logged-in users)
router.delete(
    '/followed/:museumId',
    authMiddleware,
    validateObjectId('museumId', Museum, 'Museum'),
    unfollowMuseum
);

// Route to get followed museums of a user (only for logged-in users)
router.get(
    '/followed',
    authMiddleware,
    getFollowedMuseums
);

module.exports = router;
// This code defines routes for user-related operations in an Express application.
// It includes a route to update a user's biography and a route to delete a user account.
// The routes are protected by middleware to ensure that only authenticated users can update their bio,
// and only admin users can delete accounts. The `validateObjectId` middleware checks the validity of the 
// user ID provided in the request parameters.