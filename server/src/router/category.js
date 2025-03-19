const express = require("express");
const categoryRouter = express.Router();
const Category = require("../models/category");

// All list category
categoryRouter.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: { msgBody: "Error fetching categories", msgError: true },
      error: error.message,
    });
  }
});

// Create category
categoryRouter.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: { msgBody: "Category name is required", msgError: true },
      });
    }

    const category = await Category.create({ name });
    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: { msgBody: "Error creating category", msgError: true },
      error: error.message,
    });
  }
});

module.exports = categoryRouter;
