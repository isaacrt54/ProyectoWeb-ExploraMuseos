const moongose = require('mongoose');

const commentSchema = new moongose.Schema({
    author: {
        type: moongose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    post: {
        type: moongose.Schema.Types.ObjectId,
        ref: 'Post', // Reference to the Post model
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

module.exports = moongose.model('Comment', commentSchema);
// This code defines a Mongoose schema and model for a Comment entity in a MongoDB database.
// The schema includes fields for the comment's author (referencing a User), the post (referencing a Post),
// the content of the comment, and the date of the comment.
// The date defaults to the current date and time when a new comment is created.