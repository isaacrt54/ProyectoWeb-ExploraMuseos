const Comment = require('../models/Comment');

// Get all comments for a specific post
const getCommentsByPost = async (req, res) => {
    try {
        const post = req.postIdData; // Provided by validateObjectId middleware

        const comments = await Comment.find({ post: post._id })
            .populate('author', 'name biography') // Populate author name and biography for tooltips
            .sort({ date: -1 }); // Sort by date in descending order
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments', error });
    }
};

// Add a new comment (only for logged-in users)
const addComment = async (req, res) => {
    try {
        const post = req.postIdData; // Provided by validateObjectId middleware

        const newComment = new Comment({
            post: post._id,
            author: req.user._id, // Provided by authentication middleware
            content: req.body.content,
        });
        
        await newComment.save();
        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(400).json({ message: 'Error adding comment', error });
    }
};

// Update an existing comment (only for the author)
const updateComment = async (req, res) => {
    const { content } = req.body;
    const userId = req.user._id; // Provided by authentication middleware
    const comment = req.commentIdData; // Provided by validateObjectId middleware

    try {        
        // Check if the user is the author of the comment
        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this comment' });
        }

        comment.content = content;
        await comment.save();

        res.status(200).json({ message: 'Comment updated successfully', comment });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Error updating comment: ', error });
    }
};

// Delete a comment (only for the author)
const deleteComment = async (req, res) => {
    const userId = req.user._id; // Provided by authentication middleware
    const comment = req.commentIdData; // Provided by validateObjectId middleware

    try {
        // Check if the user is the author of the comment
        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this comment' });
        }

        await comment.deleteOne();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Error deleting comment: ', error });
    }
};

module.exports = {
    getCommentsByPost,
    addComment,
    updateComment,
    deleteComment
};
// This code defines a controller for handling comment-related operations in an Express application.