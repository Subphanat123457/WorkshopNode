var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Order Schema */
var orderSchema = new Schema({
    productId: {type: Schema.Types.ObjectId, ref: 'products', required: true},
    quantity: {type: Number, required: true},
    customerId: {type: Schema.Types.ObjectId, ref: 'users', required: true},
},
{
    timestamps: true
});

module.exports = mongoose.model('order', orderSchema);


