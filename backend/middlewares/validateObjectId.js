const mongoose = require('mongoose');

// Middleware to validate ObjectId parameters in Express.js
const validateObjectId = (paramName, model, modelName = 'Element') => {
    return async (req, res, next) => {
        const id = req.params[paramName];

        // Check if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: `Invalid ${modelName}'s ID` });
        }

        // Check if the ID exists in the database
        try {
            const item = await model.findById(id);
            if (!item) {
                return res.status(404).json({ message: `${modelName} not found` });
            }

            // Save the item in the request object for further use
            req[paramName + 'Data'] = item;

            next();
        } catch (error) {
            console.error(`Error validating ${modelName} ID:`, error);
            return res.status(500).json({ message: `Error validating ${modelName} ID`, error });
        }
    }
}

module.exports = validateObjectId;
// This middleware function validates an ObjectId parameter in the request.
// It checks if the ID is a valid MongoDB ObjectId and if it exists in the specified model.