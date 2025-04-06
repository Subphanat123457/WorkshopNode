var express = require('express');
var router = express.Router();
var User = require('../models/user.model');
var jwtAutherization = require('../middleware/jwtAutherization');
var jwtAutherizationAdmin = require('../middleware/jwtAutherizationAdmin');

/* GET users listing. */
// router.get('/users', async function(req, res, next) {
//   try {
//     const users = await User.find();
//     res.status(200).json({
//       status: 'success',
//       message: 'successfully',
//       data: users
//     })
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

/* Admin approve user */
router.put('/:id/approve', [jwtAutherization, jwtAutherizationAdmin], async function(req, res, next) {
  const { id } = req.params;
  const isApproved = req.body.isApproved;
  try {
    const user = await User.findByIdAndUpdate(id, { isApproved }, { new: true });
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
