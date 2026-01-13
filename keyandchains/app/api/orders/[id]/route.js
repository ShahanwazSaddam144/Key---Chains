// app/api/orders/[id]/route.js
import { NextResponse } from "next/server";
import Orders from "../../../Database/orders"; // adjust if needed
import mongoose from "mongoose";
import connectToDb from "../../../lib/mongodb";
export async function GET(req, { params }) {
  try {
    const { id } = params;
    const url = new URL(req.url);
    const userEmail = url.searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json({ message: "User Email is required" }, { status: 400 });
    }

    await connectToDb();

    // validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid Order ID" }, { status: 400 });
    }

    const order = await Orders.findOne({ _id: id, userEmail });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error("Order fetch error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
