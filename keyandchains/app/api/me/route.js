// app/api/auth/me/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import verifyToken from "../../lib/verifyToken";
import User from "../../Database/users"; 
import connectToDb from "../../lib/mongodb";
export async function GET() {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 403 });
    }
    await connectToDb();
    const user = await User.findById(decoded.uid).select("-pass");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error("Fetch current user error:", err);
    return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 });
  }
}
