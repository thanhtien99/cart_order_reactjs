const express = require('express');
const cartRouter = express.Router();
const Cart = require('../models/cart');
const User = require('../models/users');

cartRouter.post('/', async (req, res) => {
  try {
    const { user, product, quantity, total_price } = req.body;

    if (!user || !product || !product.id || quantity <= 0 || !total_price) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cart = await Cart.findOne({ user: user, "product.id" : product.id });
    
    if (cart) {
      cart.quantity += quantity;
      cart.total_price += total_price;

      const updatedCart = await cart.save();
      return res.status(200).json({ message: 'Cart updated successfully', data: updatedCart });

    } else {
      const newCart = new Cart({
        user: user,
        product: product,
        quantity: quantity,
        total_price: total_price,
      });
  
      const savedCart = await newCart.save();
      return res.status(201).json({ message: 'Cart created successfully', data: savedCart });
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

    const cart = await Cart.findById(id);

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.quantity = quantity;
    cart.total_price = cart.product[0].price * quantity;

    const updatedCart = await cart.save();
    return res.status(200).json({ message: 'Cart updated successfully', data: updatedCart });
  } catch (error) {
    console.error('Error updating cart:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

cartRouter.get('/', async (req, res) => {
  try {
    const { user } = req.query;
    
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const carts = await Cart.find({ user: user });
    res.status(200).json({
      success: true,
      data: carts,
    });

  } catch (error) {
    console.error('Error saving cart:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

cartRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findByIdAndDelete(id);
    if (!cart) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    return res.status(200).json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = cartRouter;
