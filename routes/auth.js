var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var User = require('../models/user.model');
var { responseBadRequest, responseUnauthorized, responseServerError, responseCreated, responseSuccess } = require('../utils/response');

/* POST login */
router.post('/login', async function(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        return responseBadRequest(res, 'กรุณากรอก email และ password');
    }
    // check user in database
    const user = await User.findOne({ email });
    if (!user) {
        return responseUnauthorized(res, 'ไม่มีผู้ใช้ที่ลงทะเบียน');
    }
    if (!user.isApproved) {
        return responseUnauthorized(res, 'ยังไม่ได้ Approved');
    }
    // Pass and create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return responseSuccess(res, { token }, 'ล็อกอินสำเร็จ');
})       

/* POST users listing. */
router.post('/register', async function(req, res, next) {
    const { email, password } = req.body; // รับแค่ Field email และ password
    if (!email || !password) {
      return responseBadRequest(res, 'กรุณากรอก email และ password');
    }
    try {
      const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS)); // เข้ารหัสรหัสผ่าน
      const user = await User.create({ email, password: hashedPassword }); // สร้างผู้ใช้ด้วย email และรหัสผ่านที่เข้ารหัส
      return responseCreated(res, user, 'created successfully');
    } catch (err) {
      return responseServerError(res, err.message);
    }
});

module.exports = router;
