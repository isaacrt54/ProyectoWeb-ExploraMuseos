const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    museum: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Museum', // Reference to the Museum model
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now, // Default to the current date and time
    }
});

module.exports = mongoose.model('Post', postSchema);
// This code defines a Mongoose schema and model for a Post entity in a MongoDB database.
// The schema includes fields for the post's author (referencing a User), the museum (referencing a Museum), 
// the content of the post, and the date of the post. 
// The date defaults to the current date and time when a new post is created.