const express = require("express");
const productRouter = express.Router();
const Product = require("../models/product");

//All list product
productRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({"createdAt":-1});
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: { msgBody: "Error fetching products", msgError: true },
      error: error.message,
    });
  }
});


//Detail product
productRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Product.findById(id);
    if (!products) {
      return res.status(404).json({ error: 'Product item not found' });
    }
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: { msgBody: "Error fetching products", msgError: true },
      error: error.message,
    });
  }
});

// Create
productRouter.post("/", async (req, res) => {
  try {
    const { name, thumbnail, price, original_price, description, category } = req.body;

    // Kiểm tra đầu vào
    if (!name || !thumbnail || !price || !original_price || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields except description are required",
      });
    }

    const newProduct = await Product.create({
      name,
      thumbnail,
      price,
      original_price,
      description,
      category,
    });

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: { msgBody: "Error creating product", msgError: true },
      error: error.message,
    });
  }
});

// update
productRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true }).populate("category");

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: { msgBody: "Error updating product", msgError: true },
      error: error.message,
    });
  }
});

module.exports = productRouter;
