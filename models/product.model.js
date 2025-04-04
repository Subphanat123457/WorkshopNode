var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('products', productSchema);
