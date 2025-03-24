const express = require('express');
const cartRouter = express.Router();
const User = require('../models/users');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const OrderItem = require('../models/order_item');
const authenticateUser = require('../middlewares/auth_middleware');

cartRouter.post('/', authenticateUser, async (req, res) => {
  try {
    const user = req.user._id;
    const { product_id, quantity } = req.body;

    if (!product_id || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid product ID or quantity' });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let cartItem = await Cart.findOne({ user, product: product_id });

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.total_price = cartItem.quantity * product.price;
    } else {
      cartItem = new Cart({
        user,
        product: product_id,
        quantity,
        total_price: product.price * quantity,
      });
    }

    await cartItem.save();
    return res.status(200).json({ message: 'Cart updated successfully', data: cartItem });
  } catch (error) {
    console.error('Error saving cart:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

cartRouter.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const cartItem = await Cart.findOne({ _id: id, user: req.user._id });
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const product = await Product.findById(cartItem.product);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    cartItem.quantity = quantity;
    cartItem.total_price = product.price * quantity;
    await cartItem.save();

    return res.status(200).json({ message: 'Cart updated successfully', data: cartItem });
  } catch (error) {
    console.error('Error updating cart:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

cartRouter.get('/', authenticateUser, async (req, res) => {
  try {
    const cartItems = await Cart.find({ user: req.user._id }).populate({
      path: 'product',
      select: 'name price thumbnail',
    });

    if (cartItems.length === 0) {
      return res.status(200).json({ message: 'Cart is empty', data: [] });
    }

    return res.status(200).json({ success: true, data: cartItems });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

cartRouter.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await Cart.findOneAndDelete({ _id: id, user: req.user._id });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    return res.status(200).json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

cartRouter.post('/order', authenticateUser, async (req, res) => {
  try {
    const cartItems = await Cart.find({ user: req.user._id }).populate('product');
    if (!cartItems.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const newOrder = new Order({ user: req.user._id });
    await newOrder.save();

    const orderItems = cartItems.map(cartItem => ({
      order: newOrder._id,
      product: cartItem.product._id,
      quantity: cartItem.quantity,
      bought_price: cartItem.product.price,
      total_price: cartItem.total_price,
    }));

    await OrderItem.insertMany(orderItems);
    await Cart.deleteMany({ user: req.user._id });

    return res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error during checkout:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

cartRouter.get('/order', authenticateUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate({
      path: 'user',
      select: 'name',
    });

    if (orders.length === 0) {
      return res.status(200).json({ message: 'No orders found', data: [] });
    }

    const orderIds = orders.map(order => order._id);
    const orderItems = await OrderItem.find({ order: { $in: orderIds } }).populate('product');

    return res.status(200).json({
      success: true,
      data: {
        orders: orders,
        order_items: orderItems,
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = cartRouter;
