const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../Database/users");
const protect = require("../middleware/protect");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

/* ======================
   NODEMAILER TRANSPORT
====================== */
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ======================
   SIGNUP
====================== */
router.post("/signup", async (req, res) => {
  const { name, email, pass } = req.body;

  if (!name || !email || !pass)
    return res.status(400).json({ message: "Missing credentials" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

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

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    // Send welcome email
    transporter.sendMail({
      from: `"Butt Networks" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Welcome to Butt Networks Admin Panel",
      html: `
        <h2>Welcome, ${user.name}!</h2>
        <p>Your admin panel account is ready.</p>
        <a href="http://localhost:3000">Go to Dashboard</a>
      `,
    });

    res.status(200).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});

/* ======================
   LOGIN
====================== */
router.post("/login", async (req, res) => {
  const { email, pass } = req.body;

  if (!email || !pass)
    return res.status(400).json({ message: "Missing credentials" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { uid: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

/* ======================
   LOGOUT
====================== */
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out" });
});

/* ======================
   CURRENT USER
====================== */
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.uid).select("-pass");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Fetch current user error:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

/* ======================
   EXPORT
====================== */
module.exports = router;