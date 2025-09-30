const express = require('express');
const router = express.Router();
// Controllers
const {
    getPostsByMuseum,
    addPost,
    updatePost,
    deletePost
} = require('../controllers/postController');
// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');
// Models
const Museum = require('../models/Museum');
const Post = require('../models/Post');

// GET all posts for a specific museum
router.get(
    '/:museumId',
    validateObjectId('museumId', Museum, 'Museum'),
    getPostsByMuseum
);

// POST a new post to a museum (authenticated)
router.post(
    '/:museumId',
    authMiddleware,
    validateObjectId('museumId', Museum, 'Museum'),
    addPost
);

// PUT update a post by postId (authenticated)
router.put(
    '/edit/:postId',
    authMiddleware,
    validateObjectId('postId', Post, 'Post'),
    updatePost
);

// DELETE a post by postId (authenticated)
router.delete(
    '/delete/:postId',
    authMiddleware,
    validateObjectId('postId', Post, 'Post'),
    deletePost
);

module.exports = router;
// This code defines the routes for handling posts related to museums in an Express application.
// It imports the necessary modules and the controller functions,
// and sets up the routes for getting posts by museum ID and adding a new post.
// The 'authMiddleware' is used to protect the route for adding a new post, ensuring that only logged-in users can access it.
// Additionally, it uses 'validateObjectId' middleware to validate the format of the museumId and postId parameters
// and ensure that they correspond to existing Museum and Post documents, respectively.