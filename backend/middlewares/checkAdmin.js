// Middleware to check if the user is an admin
const checkAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next(); // User is an admin, proceed to the next middleware or route handler
    }

    return res.status(403).json({ message: 'Access denied. Admins only.' });
};

module.exports = checkAdmin;
// This middleware checks if the user has an admin role.