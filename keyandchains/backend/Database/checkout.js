const mongoose = require("mongoose");

const checkoutschema = new mongoose.Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    userEmail: { type: String, required: true },  
    price: { type: Number, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },  
    addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CheckOut", checkoutschema);
