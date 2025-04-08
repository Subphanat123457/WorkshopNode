const jwt = require('jsonwebtoken');
const { responseUnauthorized } = require('../utils/response');
const User = require('../models/user.model');

module.exports = async function (req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return responseUnauthorized(res, 'Unauthorization');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user || !user.isApproved) {
            return responseUnauthorized(res, 'User is not an admin');
        }
        req.user = decoded;
        next();
    } catch (err) {
        return responseUnauthorized(res, 'Token is Broken');
    }
};
