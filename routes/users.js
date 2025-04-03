var express = require('express');
var router = express.Router();
var User = require('../models/user.model');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
