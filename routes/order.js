var express = require('express');
var router = express.Router();
var Order = require('../models/order.model');
var Product = require('../models/product.model');
var jwtAutherization = require('../middleware/jwtAutherization');


router.get('/', [jwtAutherization], async function (req, res, next) {
    const orders = await Order.find();
    try {
        res.status(200).json({
            status: 'success',
            message: 'Orders fetched successfully',
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching orders',
            data: null
        });
    }
});


module.exports = router;


