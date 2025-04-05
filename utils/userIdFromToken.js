var jwt = require('jsonwebtoken');

// function to get userId from token
const getUserIdFromToken = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
}

module.exports = getUserIdFromToken;
