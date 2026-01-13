import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    userEmail: { type: String, required: true },
  },
  { timestamps: true }
);

// Hot reload safe
const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;
