var express = require('express');
var router = express.Router();
var Order = require('../models/order.model');
var Product = require('../models/product.model');
var jwtAutherization = require('../middleware/jwtAutherization');
var { responseSuccess, responseServerError } = require('../utils/response');

router.get('/', [jwtAutherization], async function (req, res, next) {
    try {
        const orders = await Order.find();
        return responseSuccess(res, orders, 'Orders fetched successfully', 200); // Added status code
    } catch (error) {
        return responseServerError(res, error.message); // Ensure error handling is correct
    }
});

module.exports = router;
