const express = require("express");
const router = express.Router();
const Orders = require("../Database/orders");
const nodemailer = require("nodemailer");

// ======================
// EMAIL TRANSPORTER
// ======================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ======================
// CREATE ORDER
// ======================
router.post("/orders", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      country,
      paymentMethod,
      paymentStatus,
      products = [],
      userEmail,
    } = req.body;

    // ----------------------
    // VALIDATION
    // ----------------------
    if (!name || !email || !address || !city || !country || !paymentMethod || !userEmail) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // ----------------------
    // CALCULATE TOTAL AMOUNT
    // ----------------------
    let amount = 0;
    for (const item of products) {
      if (!item.name || !item.price || !item.quantity) {
        return res.status(400).json({ success: false, message: "Invalid product data" });
      }
      amount += item.price * item.quantity;
    }

    // ----------------------
    // SAVE ORDER TO MONGODB
    // ----------------------
    const order = new Orders({
      name,
      email,
      phone,
      address,
      city,
      country,
      paymentMethod,
      paymentStatus: paymentStatus || "COD",
      amount,
      products,
      userEmail,
      createdAt: new Date(),
    });

    await order.save();

    // ----------------------
    // PREPARE EMAIL HTML
    // ----------------------
    let productRows = "";
    if (products.length > 0) {
      productRows = products
        .map(
          (item, i) => `
          <tr>
            <td style="padding:8px;">${i + 1}</td>
            <td style="padding:8px;">${item.name}</td>
            <td style="padding:8px;">${item.quantity}</td>
            <td style="padding:8px;">$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>`
        )
        .join("");
    }

    const mailOptions = {
      from: `"Key&Chains" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Confirmation - ${order._id}`,
      html: `
        <div style="font-family: Arial; max-width:600px; margin:auto;">
          <h2>Hi ${name},</h2>
          <p>Your order has been placed successfully ✅</p>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
          <p><strong>Total:</strong> $${amount.toFixed(2)}</p>

          ${
            products.length > 0
              ? `<h3>Products</h3>
                 <table width="100%" border="1" cellspacing="0" cellpadding="5">
                   <tr><th>#</th><th>Product</th><th>Qty</th><th>Price</th></tr>
                   ${productRows}
                 </table>`
              : ""
          }

          <h3>Shipping Address</h3>
          <p>${address}, ${city}, ${country}</p>

          <p>Thank you for shopping with <strong>Key&Chains</strong>!</p>
        </div>
      `,
    };

    // send email asynchronously
    transporter.sendMail(mailOptions).catch((err) => console.error("Email error:", err));

    // ----------------------
    // RESPONSE
    // ----------------------
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /orders/:id
router.get("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.query.userEmail;

    if (!userEmail) return res.status(400).json({ message: "User Email is required" });

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Order ID" });
    }

    // Find order by _id and userEmail
    const order = await Orders.findOne({ _id: mongoose.Types.ObjectId(id), userEmail });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (err) {
    console.error("Order fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
