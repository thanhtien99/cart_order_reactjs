const express = require('express');
const cartRouter = express.Router();
const User = require('../models/users');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const OrderItem = require('../models/order_item');

cartRouter.post('/', async (req, res) => {
  try {
    const { user, product_id, name, thumbnail, quantity, price, total_price } = req.body;

    if (!user || !product_id || !name || !thumbnail || quantity <= 0 || price <= 0 || total_price <=0 ) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    let cartOrder = await CartOrder.findOne({ user, status: 'in_cart' });
    if (!cartOrder) {
      cartOrder = new CartOrder({ user });
      await cartOrder.save();
    }

    const cartItem = await CartOrderItem.findOne({
      cart_order: cartOrder._id,
      product: product_id,
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.total_price = cartItem.quantity * cartItem.price;
      await cartItem.save();
      return res.status(200).json({ message: 'Cart item updated successfully', data: cartItem });
    } else {
      const newCartItem = new CartOrderItem({
        cart_order: cartOrder._id,
        product: product_id,   
        name,
        thumbnail,
        quantity,
        price,
        total_price: price * quantity,
      });
      await newCartItem.save();
      return res.status(201).json({ message: 'Cart item added successfully', data: newCartItem });
    }

  } catch (error) {
    console.error('Error saving cart:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


cartRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const cartItem = await CartOrderItem.findById(id);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    cartItem.quantity = quantity;
    cartItem.total_price = cartItem.price * quantity;
    const updatedCartItem = await cartItem.save();

    return res.status(200).json({ message: 'Cart updated successfully', data: updatedCartItem });
  } catch (error) {
    console.error('Error updating cart:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

cartRouter.get('/', async (req, res) => {
  try {
    const { user, status } = req.query;

    if (!user) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cartOrders = await CartOrder.find({
      user,
      status: status,
    }).populate({
      path: 'user',
      select: 'name',
    });
    

    if (cartOrders.length === 0) {
      return res.status(404).json({ error: 'No carts found for the given criteria' });
    }

    const cartItems = await CartOrderItem.find({
      cart_order: { $in: cartOrders.map((order) => order._id) },
    });

    return res.status(200).json({
      success: true,
      data: {
        cart_orders: cartOrders,
        cart_items: cartItems,
      },
    });
  } catch (error) {
    console.error('Error fetching cart orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

cartRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await CartOrderItem.findByIdAndDelete(id);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    return res.status(200).json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = cartRouter;
