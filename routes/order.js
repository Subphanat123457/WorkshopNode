var express = require('express');
var router = express.Router();
var Order = require('../models/order.model');
var Product = require('../models/product.model');
var jwtAutherization = require('../middleware/jwtAutherization');


router.get('/orders', [jwtAutherization], async function (req, res, next) {
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

router.get('/products/:id/orders', [jwtAutherization], async function (req, res, next) {
    const { id } = req.params;
    const orders = await Order.find({ productId: id });
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
            error: error
        });
    }
});
router.post('/products/:id/orders', [jwtAutherization], async function (req, res, next) {
    const { id } = req.params;
    const { quantity } = req.body;
    // const userId = getUserIdFromToken(req.headers.authorization);
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found',
                data: null
            });
        }
        if (product.quantity < quantity) {
            return res.status(400).json({
                status: 'error',
                message: 'Insufficient quantity',
                data: null
            });
        }
        const order = new Order({
            productId: id,
            quantity: quantity,
        });
        await order.save();
        res.status(201).json({
            status: 'success',
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error creating order',
            data: null
        });
    }
});

module.exports = router;


