var jwt = require('jsonwebtoken');

// function to get userId from token
const getUserIdFromToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Invalid token format');
    }
    const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
}

module.exports = getUserIdFromToken;
