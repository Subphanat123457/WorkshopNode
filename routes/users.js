var express = require('express');
var router = express.Router();
var User = require('../models/user.model');
var jwtAutherization = require('../middleware/jwtAutherization');
var jwtAutherizationAdmin = require('../middleware/jwtAutherizationAdmin');
var { responseSuccess, responseBadRequest, responseServerError } = require('../utils/response');

/* Admin approve user */
router.put('/:id/approve', [jwtAutherization, jwtAutherizationAdmin], async function (req, res, next) {
  const { id } = req.params;
  const isApproved = req.body.isApproved;
  if (!id) {
    return responseBadRequest(res, 'Id is not found');
  }
  if (!isApproved) {
    return responseBadRequest(res, 'isApproved is required');
  }
  try {
    const user = await User.findByIdAndUpdate(id, { isApproved }, { new: true });
    if (!user) {
      return responseBadRequest(res, 'User not found');
    }
    return responseSuccess(res, user, 'Approved successfully');
  } catch (err) {
    return responseServerError(res, err.message);
  }
});

module.exports = router;
