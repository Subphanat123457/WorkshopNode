var express = require('express');
var router = express.Router();
/* models */
var Product = require('../models/product.model');
var Order = require('../models/order.model');
/* middleware */
var jwtAutherization = require('../middleware/jwtAutherization');
/* utils */
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var getUserIdFromToken = require('../utils/userIdFromToken');
var { responseSuccess, responseCreated, responseBadRequest, responseServerError } = require('../utils/response');

// multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })
// ------------- //

/* GET products listing. */
router.get('/', [jwtAutherization], async function (req, res, next) {
    const userId = getUserIdFromToken(req.headers.authorization);
    const products = await Product.find({ customer: userId });
    try {
        return responseSuccess(res, products, 'Products fetched successfully');
    } catch (err) {
        return responseServerError(res, 'An error occurred while fetching the products');
    }
});

router.get('/all', [jwtAutherization], async function (req, res, next) {
    const products = await Product.find({});
    try {
        return responseSuccess(res, products, 'Products fetched successfully');
    } catch (err) {
        return responseServerError(res, 'An error occurred while fetching the products');
    }
});


/* POST product */
router.post('/', [jwtAutherization, upload.single('image')], async function (req, res, next) {
    const { name, price, description, quantity, image } = req.body;
    // const image = req.file ? req.file.filename : null;
    const userId = getUserIdFromToken(req.headers.authorization);
    // if (!name || !price || !description || !image || !quantity) {
    //     return responseBadRequest(res, 'Missing required fields');
    // }
    try {
        const product = new Product({ name, price, description, image, quantity, customer: userId });
        await product.save();
        return responseCreated(res, product, 'Product created successfully');
    } catch (err) {
        return responseServerError(res, 'An error occurred while creating the product');
    }
});

/* PUT product */
router.put('/:id', [jwtAutherization, upload.single('image')], async function (req, res, next) {
    const userId = getUserIdFromToken(req.headers.authorization);
    const { id } = req.params;
    const { name, price, description, quantity, image } = req.body;
    // const image = req.file ? req.file.filename : null; // Handle image upload

    if (!name || !price || !description || !image || !quantity) {
        return responseBadRequest(res, 'Missing required fields');
    }
    if (!id) {
        return responseBadRequest(res, 'Id is not found');
    }

    try {
        const product = await Product.findById(id, { customer: userId });
        if (!product) {
            return responseBadRequest(res, 'Product not found');
        }

        const productData = { name, price, description, quantity, image }; // Prepare updated data
        const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
        return responseSuccess(res, updatedProduct, 'Product updated successfully');
    } catch (err) {
        return responseServerError(res, 'An error occurred while updating the product');
    }
});

/* DELETE product */
router.delete('/:id', [jwtAutherization], async function (req, res, next) {
    const userId = getUserIdFromToken(req.headers.authorization);
    const { id } = req.params;
    if (!id) {
        return responseBadRequest(res, 'Id is not found');
    }
    try {
        const product = await Product.findByIdAndDelete(id, { customer: userId });
        return responseSuccess(res, product, 'Product deleted successfully');
    } catch (err) {
        return responseServerError(res, 'An error occurred while deleting the product');
    }
});

/* GET product by id */
router.get('/:id', [jwtAutherization], async function (req, res) {
    // const userId = getUserIdFromToken(req.headers.authorization);
    const { id } = req.params;
    try {
        const product = await Product.findById({ _id: id });
        if (!product) {
            return responseBadRequest(res, 'Product not found');
        }
        return responseSuccess(res, product, 'Product fetched successfully');
    } catch (err) {
        return responseServerError(res, 'An error occurred while fetching the product');
    }
});


/* GET product orders */
router.get('/:id/orders', [jwtAutherization], async function (req, res) {
    const { id } = req.params;
    if (!id) {
        return responseBadRequest(res, 'Id is not found');
    }

    try {
        const orders = await Order.find({ productId: id });
        return responseSuccess(res, orders, 'Orders fetched successfully');
    } catch (err) {
        return responseServerError(res, 'An error occurred while fetching the orders');
    }
});

/* POST product order */
router.post('/:id/orders', [jwtAutherization], async function (req, res) {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!quantity) {
        return responseBadRequest(res, 'Missing required fields');
    }
    if (!userId) {
        return responseBadRequest(res, 'User not found');
    }
    if (!id) {
        return responseBadRequest(res, 'Id is not found');
    }
    try {
        const order = await Order.find({ productId: id });
        const totalQuantity = order.reduce((acc, curr) => acc + curr.quantity, 0);
        const product = await Product.findById(id);

        if (!product) {
            return responseBadRequest(res, 'Product not found');
        }
        if (product.quantity < quantity + totalQuantity) {
            return responseBadRequest(res, 'Insufficient quantity');
        }

        const newOrder = new Order({
            productId: id,
            quantity: quantity,
            customerId: userId,
        });
        await newOrder.save();
        return responseCreated(res, newOrder, 'Order created successfully');
    } catch (err) {
        return responseServerError(res, 'An error occurred while creating the order');
    }
});


module.exports = router;