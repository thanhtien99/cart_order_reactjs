const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Cart = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Array , required: true},
  total_product: { type: Number, required: true, min: 1 },
  total_price: { type: Number, default: 0 },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Cart', Cart);
