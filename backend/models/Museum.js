const mongoose = require('mongoose');

const museoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    webSite: {
        type: String,
        required: true,
    },
    image: {
        type: String, // URL of the image
        required: true,
    },
    tags: {
        type: [String], // Array of tags e.g: ["art", "history"]
        required: true,
    },
});

module.exports = mongoose.model('Museum', museoSchema);
// This code defines a Mongoose schema and model for a Museum entity in a MongoDB database.
// The schema includes fields for the museum's name, description, location, website, image URL, and tags.