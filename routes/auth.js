var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
// var bcrypt = require('bcrypt');
var User = require('../models/user.model');

/* POST login */
router.post('/login', async function(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'กรุณากรอก email และ password',
            data: null
        });
    }
    // check user in database
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({
            status: 'error',
            message: 'ไม่มีผู้ใช้ที่ลงทะเบียน',
            data: null
        });
    }
    if (!user.isApproved) {
        return res.status(403).json({
            status: 'error',
            message: 'ยังไม่ได้ Approved',
            data: null
        });
    }
    // Pass and create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
        status: 'success',
        message: 'ล็อกอินสำเร็จ',
        data: { token }
    });

})       

module.exports = router;
