const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Get all posts for a specific museum
const getPostsByMuseum = async (req, res) => {
    try {
        const museum = req.museumIdData; // Provided by validateObjectId middleware
        const posts = await Post.find({ museum: museum._id })
            .populate('author', 'name biography') // Populate author name and biography for tooltips
            .sort({ date: -1 }); // Sort by date in descending order
            res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts', error });
    }
};

// Add a new post (only for logged-in users)
const addPost = async (req, res) => {
    try {
        const museum = req.museumIdData; // Provided by validateObjectId middleware
        const newPost = new Post({
            author: req.user._id, // Provided by authentication middleware
            museum: museum._id,
            content: req.body.content,
        });

        await newPost.save();
        // Populate the author field with the author's name and biography
        await newPost.populate('author', 'name biography');
        res.status(201).json({ message: 'Post added successfully', post: newPost });
    } catch (error) {
        console.error('Error adding post:', error);
        res.status(400).json({ message: 'Error adding post', error });
    }
};

// Update an existing post (only for the author)
const updatePost = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user._id; // Provided by authentication middleware
        const post = req.postIdData; // Provided by validateObjectId middleware
        // Check if the user is the author of the post
        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this post' });
        }

        post.content = content;
        await post.save();

        res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Error updating post: ', error });
    }
};

// Delete a post (only for the author)
const deletePost = async (req, res) => {
    try {
        const post = req.postIdData; // Provided by validateObjectId middleware
        const userId = req.user._id; // Provided by authentication middleware
        // Check if the user is the author of the post
        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this post' });
        }

        // Delete the comments associated with the post
        await Comment.deleteMany({ post }); // delete * from comment where post = id
        // Delete the post itself
        await post.deleteOne();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Error deleting post: ', error });
    }
};

// Delete a post by ID (used internally, e.g., when deleting a user)
const deletePostById = async (postId) => {
    const post = await Post.findById(postId);
    if (!post) {
        console.error('Post not found with ID:', postId);
        return;
    }
    // Delete the comments associated with the post
    await Comment.deleteMany({ post: postId }); // delete * from comment where post = id
    // Delete the post itself
    await post.deleteOne();
};

module.exports = {
    getPostsByMuseum,
    addPost,
    updatePost,
    deletePost,
    deletePostById
};
// This code defines a controller for handling post-related operations in an Express application.