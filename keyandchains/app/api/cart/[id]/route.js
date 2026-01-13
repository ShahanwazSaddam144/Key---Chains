// app/api/cart/[id]/route.js
import { NextResponse } from "next/server";
import Cart from "../../../Database/cart"; // adjust path if needed
import mongoose from "mongoose";
import connectToDb from "../../../lib/mongodb";
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid item id" }, { status: 400 });
    }
    await connectToDb();
    const deletedItem = await Cart.findByIdAndDelete(id);
    if (!deletedItem) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(
      { deletedItem, message: "Item removed from cart" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Delete cart item error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
