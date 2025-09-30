const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token and attach user information to the request object
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = { 
            _id: user._id,
            role: user.role
        }; // Attach the user information to the request object

        next(); // Call the next middleware or route handler
    } catch (error) {   
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Invalid token', error });
    }
};

module.exports = authMiddleware;
// This code defines an authentication middleware for an Express application.
// It checks for a valid JWT token in the request headers and attaches the user information to the request object if the token is valid.