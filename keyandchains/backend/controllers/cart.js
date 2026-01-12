const express = require("express");
const router = express.Router();
const Cart = require("../Database/cart");

// ======================
// ADD ITEM TO CART
// ======================
router.post('/cart', async (req, res) => {
  try {
    const { id, name, price, description, userEmail } = req.body;

    if (!id || !name || !price || !description || !userEmail) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cartItem = new Cart({ productId: id, name, price, description, userEmail });
    await cartItem.save();

    // Return the saved item as an array for consistency with frontend
    res.status(201).json({ cart: [cartItem], message: "Product added to cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
// GET CART ITEMS FOR USER
// ======================
router.get('/cart', async (req, res) => {
  try {
    const userEmail = req.query.userEmail;
    if (!userEmail) return res.status(400).json({ message: "User email is required" });

    const items = await Cart.find({ userEmail });

    // Always return an array
    res.status(200).json(Array.isArray(items) ? items : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
// DELETE SINGLE ITEM
// ======================
router.delete('/cart/:id', async (req, res) => {
  try {
    const deletedItem = await Cart.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ deletedItem, message: "Item removed from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
// DELETE ALL CART ITEMS FOR USER
// ======================
router.delete('/cart', async (req, res) => {
  try {
    const userEmail = req.query.userEmail; 
    if (!userEmail) return res.status(400).json({ message: "User email is required" });

    const result = await Cart.deleteMany({ userEmail });
    res.status(200).json({ message: "All cart items deleted", deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
