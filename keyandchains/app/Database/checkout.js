import mongoose from "mongoose";

const checkOutSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  userEmail: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now },
});

// Hot reload safe
const CheckOut = mongoose.models.CheckOut || mongoose.model("CheckOut", checkOutSchema);

export default CheckOut;
