const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { deletePostById } = require('./postController');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Controller to update user's biography
const updateBio = async (req, res) => {
    try {
        const { biography } = req.body;
        const user = await User.findById(req.user._id); // Provided by authentication middleware

        user.biography = biography; // Update the biography field
        await user.save(); // Save the updated user

        res.status(200).json({ message: 'Biography updated successfully', user });
    } catch (error) {
        console.error('Error updating biography:', error);
        res.status(500).json({ message: 'Error updating biography: ', error });
    }
};

// Controller to update user's password
const updatePassword = async (req, res) => {
    try {
        const { password, newPassword } = req.body;
        const user = await User.findById(req.user._id); // Provided by authentication middleware

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword; // Update the password field
        await user.save(); // Save the updated user

        res.status(200).json({ message: 'Password updated successfully', user });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Error updating password: ', error });
    }
};

// Controller to get user by ID
const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('name biography');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ name: user.name, biography: user.biography });
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Error fetching user by ID', error });
    }
}

// Controller to get all users (for admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('name email role biography'); // Select fields to return
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Controller to update a user's role (for admin)
const updateUserRole = async (req, res) => {
    const userId = req.params.userId; // Provided by validateObjectId middleware
    const { role } = req.body; // Role should be provided in the request body
    try {
        const user = await User.findById(userId);

        user.role = role; // Update the role field
        await user.save(); // Save the updated user
        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Error updating user role', error });
    }
};

// Controller to delete a user account (for admin)
const deleteUser = async (req, res) => {
    const user = await User.findById(req.user._id); // Provided by authentication middleware (the admin user)
    const userToDelete = req.userIdData; // Provided by validateObjectId middleware (the user to delete)

    try {
        // Check that the admin is not trying to delete their own account
        if (user._id === userToDelete._id) {
            return res.status(400).json({ message: 'You cannot delete your own account' });
        }

        // Delete all posts made by the user (using the deletePostById function)
        const posts = await Post.find({ author: userToDelete._id });
        for (const post of posts) {
            await deletePostById(post._id);
        }
        // Delete all comments made by the user  
        await Comment.deleteMany({ author: userToDelete._id });

        // Delete the user account
        await userToDelete.deleteOne();

        res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).json({ message: 'Error deleting user account: ', error });
    }
};

// Controller to follow a museum
const followMuseum = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); // Provided by authentication middleware
        const museum = req.museumIdData; // Provided by validateObjectId middleware
        
        // Check if the user is already following the museum
        if (!user.followedMuseums.includes(museum._id)) {
            user.followedMuseums.push(museum._id);
            await user.save();
            res.status(200).json({ message: 'Museum followed successfully' });
        } else {
            res.status(400).json({ message: 'Museum already followed' });
        }
    } catch (error) {
        console.error('Error following museum:', error);
        res.status(500).json({ message: 'Error following museum', error });
    }
};

// Controller to unfollow a museum
const unfollowMuseum = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); // Provided by authentication middleware
        const museum = req.museumIdData; // Provided by validateObjectId middleware
        
        user.followedMuseums = user.followedMuseums.filter(
            (_id) => _id.toString() !== museum._id.toString()
        );

        await user.save();
        res.status(200).json({ message: 'Museum unfollowed successfully' });
    } catch (error) {
        console.error('Error unfollowing museum:', error);
        res.status(500).json({ message: 'Error unfollowing museum', error });
    }
};


// Controller to get followed museums
const getFollowedMuseums = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('followedMuseums'); // Populate followedMuseums with museum details

        res.status(200).json({ followedMuseums: user.followedMuseums });
    } catch (error) {
        console.error('Error fetching followed museums:', error);
        res.status(500).json({ message: 'Error fetching followed museums', error });
    }
};

module.exports = {
    updateBio,
    updatePassword,
    getUserById,
    getAllUsers,
    updateUserRole,
    deleteUser,
    followMuseum,
    unfollowMuseum,
    getFollowedMuseums
};
// This code defines a controller for updating a user's biography in an Express application.