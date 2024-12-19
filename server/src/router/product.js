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

module.exports = productRouter;
