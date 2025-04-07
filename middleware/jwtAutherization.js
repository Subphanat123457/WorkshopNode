var jwt = require('jsonwebtoken');
var { responseUnauthorized } = require('../utils/response');

/* JWT Authorization */
module.exports = async function (req, res, next) {
    const token = req.headers.authorization; 
    if (!token) {
        return responseUnauthorized(res, 'Unauthorization')
    }
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            return responseUnauthorized(res, 'Token is Broken');
        }
        req.user = decoded; // Store decoded token data in request object
        next(); // Moved next() inside the callback to ensure it runs after verification
    });
}
