const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
  name: { type: String, require: true },
  thumbnail: { type: String, require: true },
  price: { type: Number, require: true },
  original_price: { type: Number, require: true },
  description: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', Product);