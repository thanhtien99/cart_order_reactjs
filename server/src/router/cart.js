const express = require('express');
const cartRouter = express.Router();
const Cart = require('../models/cart');
const User = require('../models/users');

cartRouter.post('/', async (req, res) => {
  try {
    const { user, product, total_product, total_price } = req.body;

    if (!user || !product || !product.id || total_product <= 0 || !total_price) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cart = await Cart.findOne({ user: user });

    if (cart) {
      const productIndex = cart.product.findIndex(p => p.id.toString() === product.id);

      console.log(productIndex);
      
      if (productIndex !== -1) {
        
        cart.product[productIndex].quantity += cart.product.reduce((sum, p) => sum + p.quantity, 0); 
        cart.product[productIndex].price = product.price;
        cart.total_product = total_product;
        cart.total_price += total_price;

        const updatedCart = await cart.save();
        return res.status(200).json({ message: 'Cart updated successfully', data: updatedCart });
      } else {

        cart.product.push({ ...product, quantity: cart.product.reduce((sum, p) => sum + p.quantity, 0) });
        cart.total_product = total_product;
        cart.total_price += total_price;

        const updatedCart = await cart.save();
        return res.status(200).json({ message: 'Cart updated with new product successfully', data: updatedCart });
      }
    }

    const newCart = new Cart({
      user: user,
      product: [{ ...product, quantity: total_product }],
      total_product: total_product,
      total_price: total_price,
    });

    const savedCart = await newCart.save();
    return res.status(201).json({ message: 'Cart created successfully', data: savedCart });

  } catch (error) {
    console.error('Error saving cart:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = cartRouter;
