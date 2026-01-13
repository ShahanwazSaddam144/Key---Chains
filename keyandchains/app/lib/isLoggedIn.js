import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET;

export function isLoggedIn() {
  const token = cookies().get("token")?.value;

  if (!token) {
    console.log("No token found");
    return;
  }

  try {
    jwt.verify(token, JWT_SECRET);
    redirect("/");
  } catch {
    return;
  }
}
