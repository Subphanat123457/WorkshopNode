var jwt = require('jsonwebtoken');
var User = require('../models/user.model'); // Ensure User model is imported

module.exports = async function (req, res, next) {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        if (err) {
            return res.status(401).json({
                status: 'Unauthorized',
                message: 'Token is Broken',
                data: null
            });
        }
        const user = await User.findById(decoded.userId); // Fetch user from database
        if (!user || !user.isAdmin) { // Check if user exists and is an admin
            return res.status(403).json({
                status: 'Unauthorized',
                message: 'User is not an admin',
                data: null
            });
        }
        req.userId = decoded.userId;
        next(); // Call next() to proceed to the next middleware
    });
}
