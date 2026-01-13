// app/api/auth/signup/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { serialize } from "cookie";
import User from "../../../Database/users"; 
import connectToDb from "../../../lib/mongodb";
const JWT_SECRET = process.env.JWT_SECRET;

// nodemailer transporter (server-side)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, pass } = body;

    if (!name || !email || !pass) {
      return NextResponse.json(
        { message: "Missing credentials" },
        { status: 400 }
      );
    }
    await connectToDb();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(pass, 12);

    const user = await User.create({
      name,
      email,
      pass: hashedPassword,
    });

    const token = jwt.sign(
      { uid: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // seconds
      path: "/",
    });

    // send welcome email (fire-and-forget but await to surface errors)
    try {
      await transporter.sendMail({
        from: `"Butt Networks" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Welcome to Butt Networks Admin Panel",
        html: `
          <h2>Welcome, ${user.name}!</h2>
          <p>Your admin panel account is ready.</p>
          <a href="${
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
          }">Go to Dashboard</a>
        `,
      });
    } catch (mailErr) {
      // Log but don't fail the whole request
      console.error("Welcome email error:", mailErr);
    }

    return NextResponse.json(
      { message: "Signup successful" },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ message: "Signup failed" }, { status: 500 });
  }
}
