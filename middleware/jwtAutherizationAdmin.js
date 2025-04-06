var jwt = require('jsonwebtoken');
var User = require('../models/user.model'); // Ensure User model is imported
var { responseUnauthorized } = require('../utils/response');

/* JWT Authorization Admin */
module.exports = async function (req, res, next) {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        if (err) {
            return responseUnauthorized(res, 'Token is Broken');
        }
        const user = await User.findById(decoded.userId); // Fetch user from database
        if (!user || !user.isAdmin) { // Check if user exists and is an admin
            return responseUnauthorized(res, 'User is not an admin');
        }
        req.userId = decoded.userId;
        next();
    });
}
