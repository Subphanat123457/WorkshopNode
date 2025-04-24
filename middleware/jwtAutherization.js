const jwt = require('jsonwebtoken');
const { responseUnauthorized } = require('../utils/response');
const User = require('../models/user.model');

module.exports = async function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return responseUnauthorized(res, 'Unauthorized');
    }

    const token = authHeader.split(' ')[1]; // ดึงเฉพาะ token จริง ๆ

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return responseUnauthorized(res, 'Token is invalid or expired');
    }
};
