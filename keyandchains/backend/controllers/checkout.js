const express = require("express");
const router = express.Router();
const CheckOut = require("../Database/checkout");

router.post('/checkout', async (req, res) => {
  try {
    const items = req.body; 
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const savedItems = [];

    for (const item of items) {
      const { id, name, price, description, quantity } = item;

      if ( !name || !price || !description || !quantity ) {
        return res.status(400).json({ message: "Please fill all fields" });
      }

      const checkOutItem = new CheckOut({
        productId: id, 
        name,
        price,
        description,
        quantity
      });

      await checkOutItem.save();
      savedItems.push(checkOutItem);
    }

    res.status(201).json({ message: "Checkout successful", savedItems });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
