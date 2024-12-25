const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartOrder = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["in_cart", "is_delivering", "success"],
      default: "in_cart",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CartOrder", CartOrder);
