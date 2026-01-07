const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Cart", cartSchema);
