// app/api/cart/route.js
import { NextResponse } from "next/server";
import Cart from "../../Database/cart"; // adjust path if needed
import connectToDb from "../../lib/mongodb";
export async function POST(req) {
  try {
    const { id, name, price, description, userEmail } = await req.json();

    if (!id || !name || price == null || !description || !userEmail) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }
    await connectToDb();
    const cartItem = new Cart({
      productId: id,
      name,
      price,
      description,
      userEmail,
    });

    await cartItem.save();

    // Return the saved item as an array for compatibility with your frontend
    return NextResponse.json({ cart: [cartItem], message: "Product added to cart" }, { status: 201 });
  } catch (err) {
    console.error("Add to cart error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userEmail = url.searchParams.get("userEmail");
    if (!userEmail) return NextResponse.json({ message: "User email is required" }, { status: 400 });

    const items = await Cart.find({ userEmail });
    return NextResponse.json(Array.isArray(items) ? items : [], { status: 200 });
  } catch (err) {
    console.error("Get cart items error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE /api/cart?userEmail=...  => deletes all items for user
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const userEmail = url.searchParams.get("userEmail");
    if (!userEmail) return NextResponse.json({ message: "User email is required" }, { status: 400 });

    const result = await Cart.deleteMany({ userEmail });
    return NextResponse.json({ message: "All cart items deleted", deletedCount: result.deletedCount }, { status: 200 });
  } catch (err) {
    console.error("Delete cart items error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
