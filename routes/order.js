var express = require('express');
var router = express.Router();
var Order = require('../models/order.model');
var Product = require('../models/product.model');
var jwtAutherization = require('../middleware/jwtAutherization');
var { responseSuccess, responseServerError } = require('../utils/response');
var getUserIdFromToken = require('../utils/userIdFromToken');

/* GET orders */
router.get('/', [jwtAutherization], async function (req, res, next) {
    try {
        const orders = await Order.find();
        return responseSuccess(res, orders, 'Orders fetched successfully', 200);
    } catch (error) {
        return responseServerError(res, 'An error occurred while fetching the orders'); 
    }
});

/* GET order by userId */
router.get('/user', [jwtAutherization], async function (req, res, next) {
    const userId = getUserIdFromToken(req.headers.authorization);
    try {
        const orders = await Order.find({ customerId: userId });
        return responseSuccess(res, orders, 'Orders fetched successfully', 200);
    } catch (error) {
        return responseServerError(res, 'An error occurred while fetching the orders'); 
    }
});

module.exports = router;
