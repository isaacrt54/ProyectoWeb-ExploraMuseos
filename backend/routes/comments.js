const express = require('express');
const router = express.Router();
// Controllers
const { 
    getCommentsByPost,
    addComment,
    updateComment,
    deleteComment
} = require('../controllers/commentController');
// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');
// Models
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// GET all comments for a specific post
router.get(
    '/:postId',
    validateObjectId('postId', Post, 'Post'),
    getCommentsByPost
);

// POST a new comment to a post (only for logged-in users)
router.post(
    '/:postId',
    authMiddleware,
    validateObjectId('postId', Post, 'Post'),
    addComment
);

// PUT update a comment by commentId (only for the author)
router.put(
    '/edit/:commentId',
    authMiddleware,
    validateObjectId('commentId', Comment, 'Comment'),
    updateComment
);

// DELETE a comment by commentId (only for the author)
router.delete(
    '/delete/:commentId',
    authMiddleware,
    validateObjectId('commentId', Comment, 'Comment'),
    deleteComment
);

module.exports = router;
// This code defines routes for handling comments in an Express application.
// It imports the necessary modules, including the comment controller and authentication middleware,
// and sets up routes for getting comments by post ID and adding a new comment.
// The `authMiddleware` ensures that only authenticated users can add comments.
// The `validateObjectId` middleware checks the validity of the post ID and comment ID parameters,
// ensuring they correspond to existing Post and Comment documents, respectively.