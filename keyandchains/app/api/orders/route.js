// app/api/orders/route.js
import { NextResponse } from "next/server";
import Orders from "../../Database/orders"; // adjust if needed
import nodemailer from "nodemailer";
import connectToDb from "../../lib/mongodb";
// transporter (server-side)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req) {
  try {
    const body = await req.json();
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
    } = body;

    // validation
    if (!name || !email || !address || !city || !country || !paymentMethod || !userEmail) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
    await connectToDb();
    // calculate amount and validate products
    let amount = 0;
    for (const item of products) {
      if (!item.name || item.price == null || item.quantity == null) {
        return NextResponse.json({ success: false, message: "Invalid product data" }, { status: 400 });
      }
      amount += Number(item.price) * Number(item.quantity);
    }

    // save order
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

    // build product rows for email
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

    // send email asynchronously — don't fail the request on mailing errors
    transporter.sendMail(mailOptions).catch((err) => console.error("Order email error:", err));

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        order,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
