var express = require('express');
var router = express.Router();
var User = require('../models/user.model');
var bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/users', async function(req, res, next) {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      message: 'successfully',
      data: users
    })
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* POST users listing. */
router.post('/register', async function(req, res, next) {
  const { email, password } = req.body; // รับแค่ Field email และ password
  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'กรุณากรอก email และ password',
      data: null
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS)); // เข้ารหัสรหัสผ่าน
    const user = await User.create({ email, password: hashedPassword }); // สร้างผู้ใช้ด้วย email และรหัสผ่านที่เข้ารหัส
    res.status(201).json({
      status: 'success',
      message: 'created successfully',
      data: user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* Admin approve user */
router.put('/users/:id/approve', async function(req, res, next) {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    
    if (user && !user.isApproved) {
      user.isApproved = true;
      await user.save();
    }

    res.status(200).json({ 
      status: 'success',
      message: 'Approved successfully',
      data: user
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'error',
      message: err.message,
      data: null 
    });
  }
});

module.exports = router;
