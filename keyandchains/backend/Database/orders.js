const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  userEmail: { type: String, required: true }, // logged-in user email
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  amount: { type: Number, default: 0 }, // total order amount
  products: [
    {
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number },
    },
  ], // optional, can be empty if no cart items
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Orders", orderSchema);
