const express = require("express");
const productRouter = express.Router();
const Product = require("../models/product");

//All list product
productRouter.get("/", async (req, res) => {
  try {
    let query = {};
    let sortOption = { createdAt: -1 };

    if (req.query.category) {
      const categories = Array.isArray(req.query.category) ? req.query.category : req.query.category.split(",");
      query.category = { $in: categories };
    }

    if (req.query.price_range) {
      const priceRanges = {
        "below_10": { $lt: 10000000 },           
        "10_20": { $gte: 10000000, $lte: 20000000 }, 
        "20_30": { $gte: 20000000, $lte: 30000000 }, 
        "above_30": { $gt: 30000000 },           
      };

      query.price = priceRanges[req.query.price_range] || {};
    }

    if (req.query.sort) {
      const sortOptions = {
        "price_asc": { price: 1 }, 
        "price_desc": { price: -1 },
        "new_product": { createdAt: -1},
        "old_product": { createdAt: 1},
      };
      sortOption = sortOptions[req.query.sort] || {};
    }

    const products = await Product.find(query).sort(sortOption);

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


//Search
productRouter.get("/search", async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ success: false, message: "Keyword is required" });
    }

    const products = await Product.find({ name: { $regex: keyword, $options: "i" } })
      .limit(5);

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching search results" });
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
