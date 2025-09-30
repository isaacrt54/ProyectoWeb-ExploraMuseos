const express = require('express');
const router = express.Router();
// Controllers
const {
    getMuseums,
    getMuseumById,
    addMuseum,
    updateMuseum,
    deleteMuseum
} = require('../controllers/museumController');
// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');
const checkAdmin = require('../middlewares/checkAdmin');
const validateObjectId = require('../middlewares/validateObjectId');
const Museum = require('../models/Museum'); 

// Route to get all museums
router.get('/', getMuseums);

// Route to get a museum by ID
router.get(
    '/:museumId',
    validateObjectId('museumId', Museum, 'Museum'),
    getMuseumById
);

// Route to add a new museum (only for admin)
router.post(
    '/',
    authMiddleware,
    checkAdmin,
    addMuseum
);

// Route to update an existing museum (only for admin)
router.put(
    '/edit/:museumId',
    authMiddleware,
    checkAdmin,
    validateObjectId('museumId', Museum, 'Museum'),
    updateMuseum
)

// Route to delete a museum (only for admin)
router.delete(
    '/delete/:museumId',
    authMiddleware,
    checkAdmin,
    validateObjectId('museumId', Museum, 'Museum'),
    deleteMuseum
);

module.exports = router;
// This code sets up the routes for the museum-related operations in an Express application.
// It imports the necessary modules and the controller functions,
// and defines the routes for getting, adding, updating, and deleting museums.