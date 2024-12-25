const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartOrderItem = new Schema({
  cart_order: { type: Schema.Types.ObjectId, ref: 'CartOrder', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, require: true },
  thumbnail: { type: String, require: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, default: 0 },
  total_price: { type: Number, default: 0 },
}, {
  timestamps: true,
});

module.exports = mongoose.model('CartOrderItem', CartOrderItem);
