const Museum = require('../models/Museum');
const Post = require('../models/Post');
const { deletePostById } = require('./postController');

// Get all museums
const getMuseums = async (req, res) => {
    try {
        const museum = await Museum.find();
        res.json(museum);
    } catch (error) {
        console.error('Error fetching museums:', error);
        res.status(500).json({ message: 'Error fetching museums', error });
    }
};

// Get museum by ID
const getMuseumById = async (req, res) => {
    try {
        const museum = req.museumIdData; // Provided by validateObjectId middleware
        
        res.json(museum);
    } catch (error) {
        console.error('Error fetching museum by ID:', error);
        res.status(500).json({ message: 'Error fetching museum', error });
    }
}

// Add a new museum (only for admin)
const addMuseum = async (req, res) => {
    try {
        const { name, description, location, webSite, image, tags } = req.body;

        const newMuseum = new Museum({
            name,
            description,
            location,
            webSite,
            image,
            tags: tags || [], // Ensure tags is an array, default to empty if not provided
        });

        await newMuseum.save();
        res.status(200).json({ message: 'Museum added successfully', museum: newMuseum });
    } catch (error) {
        console.error('Error adding museum:', error);
        res.status(500).json({ message: 'Error adding museum', error });
    }
};

// Update an existing museum (only for admin)
const updateMuseum = async (req, res) => {
    try {
        const museum = req.museumIdData; // Provided by validateObjectId middleware
        const { name, description, location, webSite, image, tags } = req.body;

        museum.name = name || museum.name;
        museum.description = description || museum.description;
        museum.location = location || museum.location;
        museum.webSite = webSite || museum.webSite;
        museum.image = image || museum.image;
        museum.tags = tags || museum.tags;
        
        await museum.save();
        res.status(200).json({ message: 'Museum updated successfully', museum });
    } catch (error) {
        console.error('Error updating museum:', error);
        res.status(500).json({ message: 'Error updating museum', error });
    }
};

// Delete a museum (only for admin)
const deleteMuseum = async (req, res) => {
    try {
        const museum = req.museumIdData; // Provided by validateObjectId middleware

        // Delete all posts associated with the museum
        const posts = await Post.find({ museum: museum._id });
        for (const post of posts) {
            // Use the deletePostById function to delete each post and delete its associated comments
            await deletePostById(post._id);
        }

        // Delete the museum
        await museum.deleteOne();
        
        res.status(200).json({ message: 'Museum deleted successfully' });
    } catch (error) {
        console.error('Error deleting museum:', error);
        res.status(500).json({ message: 'Error deleting museum', error });
    }
};

module.exports = {
    getMuseums,
    getMuseumById,
    addMuseum,
    updateMuseum,
    deleteMuseum
};
// This code defines a controller for handling museum-related operations in an Express application.