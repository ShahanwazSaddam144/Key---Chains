// app/api/checkout/route.js
import { NextResponse } from "next/server";
import CheckOut from "../../Database/checkout"; // adjust path if needed
import connectToDb from "../../lib/mongodb";
export async function POST(req) {
  try {
    const items = await req.json();

    // Validate cart presence
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    // Validate every item first (fail fast without saving anything)
    for (const item of items) {
      const { id, name, price, description, quantity, userEmail } = item;
      if (!name || price == null || !description || quantity == null || !userEmail) {
        return NextResponse.json(
          {
            message:
              "Missing required fields (name, price, description, quantity, userEmail)",
          },
          { status: 400 }
        );
      }
    }
    await connectToDb();

    // Save all items (concurrently)
    const savedItems = await Promise.all(
      items.map(async (item) => {
        const { id, name, price, description, quantity, userEmail } = item;
        const checkOutItem = new CheckOut({
          productId: id,
          name,
          price,
          description,
          quantity,
          userEmail,
        });
        return checkOutItem.save();
      })
    );

    return NextResponse.json(
      {
        message: "Checkout successful",
        savedItems,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
