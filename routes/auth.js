var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var User = require('../models/user.model');
var { responseBadRequest, responseUnauthorized, responseServerError, responseCreated, responseSuccess } = require('../utils/response');

/* POST login */
router.post('/login', async function (req, res, next) {
    const { email, password } = req.body;
    /* Check pattern Email */
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return responseBadRequest(res, 'Invalid email format');
    }
    if (!email || !password) {
        return responseBadRequest(res, 'Please enter email and password');
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return responseUnauthorized(res, 'No registered user found');
        }
        if (!user.isApproved) {
            return responseUnauthorized(res, 'Not yet approved');
        }
        // Pass and create token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return responseSuccess(res, { token }, 'Login successful');

    } catch (err) {
        return responseServerError(res, 'An error occurred while logging in');
    }
})

/* POST users listing. */
router.post('/register', async function (req, res, next) {
    const { email, password } = req.body;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return responseBadRequest(res, 'Invalid email format');
    }
    if (!email || !password) {
        return responseBadRequest(res, 'Please enter email and password');
    }
    try {
        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS)); // เข้ารหัสรหัสผ่าน
        const user = await User.create({ email, password: hashedPassword });
        return responseCreated(res, user, 'created successfully');
    } catch (err) {
        return responseServerError(res, 'An error occurred while creating the user');
    }
});

module.exports = router;
