const express = require("express");
const router = express.Router();
const Cart = require("../Database/cart");

router.post('/cart', async (req, res) => {
  try {
    const { id, name, price, description } = req.body;
    if (!id || !name || !price || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const cartItem = new Cart({ productId: id, name, price, description });
    await cartItem.save();
    res.status(201).json({ message: "Product added to cart", cartItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/cart', async (req, res) => {
  try {
    const items = await Cart.find();
    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete('/cart/:id', async (req, res) => {
  try {
    const deletedItem = await Cart.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item removed from cart", deletedItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete all cart items
router.delete('/cart', async (req, res) => {
  try {
    const result = await Cart.deleteMany({});
    res.status(200).json({ 
      message: "All cart items deleted", 
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
