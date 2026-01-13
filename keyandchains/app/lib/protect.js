import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import verifyToken from "@/utiles/token";

const JWT_SECRET = process.env.JWT_SECRET;

export async function protect() {
  try {
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token, JWT_SECRET);

    if (!decoded) {
      return NextResponse.json(
        { message: "Invalid token: Empty payload" },
        { status: 403 }
      );
    }

    return decoded; 
  } catch (error) {
    console.error("JWT Protection Error:", error.message);

    return NextResponse.json(
      {
        message: "Invalid or expired token",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 403 }
    );
  }
}
