var express = require('express');
var router = express.Router();
var Product = require('../models/product.model');
var jwtAutherization = require('../middleware/jwtAutherization');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var getUserIdFromToken = require('../utils/userIdFromToken');
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
router.get('/products', [jwtAutherization], async function (req, res, next) {
    const userId = getUserIdFromToken(req.headers.authorization);
    const products = await Product.find({ customer: userId });
    try {
        res.status(200).json({
            status: 'success',
            message: 'Products fetched successfully',
            data: products
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
            data: null
        });
    }
});


/* POST product */
router.post('/products', [jwtAutherization, upload.single('image')], async function (req, res, next) {
    const { name, price, description, quantity } = req.body;
    const image = req.file ? req.file.filename : null;
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!name || !price || !description || !image || !quantity) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing required fields',
            data: null
        });
    }

    try {
        const product = new Product({ name, price, description, image, quantity, customer: userId });
        await product.save();
        res.status(201).json({
            status: 'success',
            message: 'Product created successfully',
            data: product
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
            data: null
        });
    }
});

/* PUT product */
router.put('/products/:id', [jwtAutherization, upload.single('image')], async function (req, res, next) {
    const userId = getUserIdFromToken(req.headers.authorization);
    const { id } = req.params;
    const { name, price, description, quantity } = req.body;
    const image = req.file ? req.file.filename : null; // Handle image upload

    try {
        const product = await Product.findById(id, { customer: userId });
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found',
                data: null
            });
        }

        const productData = { name, price, description, quantity, image }; // Prepare updated data
        if (image) {
            const oldImage = product.image;
            if (oldImage) {
                const imagePath = path.join(__dirname, '../public/images', oldImage);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully',
            data: updatedProduct
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
            data: null
        });
    }
});

/* DELETE product */
router.delete('/products/:id', [jwtAutherization], async function (req, res, next) {
    const userId = getUserIdFromToken(req.headers.authorization);
    const { id } = req.params;
    try {
        await Product.findByIdAndDelete(id, { customer: userId });
        res.status(200).json({
            status: 'success',
            message: 'Product deleted successfully',
            data: null
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