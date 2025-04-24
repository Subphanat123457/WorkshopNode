const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { responseUnauthorized } = require('../utils/response');

/* JWT Authorization Admin */
module.exports = async function (req, res, next) {
    const authHeader = req.headers.authorization;

    // ถ้าไม่มี Authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return responseUnauthorized(res, 'Authorization header missing or malformed');
    }

    const token = authHeader.split(' ')[1]; // แยก Bearer ออก ได้ token จริง

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || !user.isAdmin) {
            return responseUnauthorized(res, 'User is not an admin');
        }

        req.userId = decoded.userId;
        next();
    } catch (err) {
        return responseUnauthorized(res, 'Token is broken or invalid');
    }
};
