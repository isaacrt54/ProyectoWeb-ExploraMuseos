const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    biography: {
        type: String,
        default: '',
    },
    followedMuseums: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Museum',
    }]
});

module.exports = mongoose.model('User', userSchema);
// This code defines a Mongoose schema and model for a User entity in a MongoDB database. 
// The schema includes fields for name, email, password, role, and biography.