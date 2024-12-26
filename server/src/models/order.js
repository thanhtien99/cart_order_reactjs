const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Order = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", Order);
