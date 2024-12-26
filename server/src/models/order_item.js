const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItem = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  bought_price: { type: Number, default: 0 },
  total_price: { type: Number, default: 0 },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order_Item', OrderItem);
