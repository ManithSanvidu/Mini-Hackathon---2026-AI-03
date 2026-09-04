const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ─── POST /api/auth/register ────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  const { name, email, password, role, officerCode } = req.body;

  // Basic field validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Name, email, password, and role are required." });
  }

  if (!["Villager", "Officer"].includes(role)) {
    return res.status(400).json({ message: "Role must be Villager or Officer." });
  }

  // Officer registration code check
  if (role === "Officer") {
    if (!officerCode || officerCode !== process.env.OFFICER_REGISTRATION_CODE) {
      return res.status(403).json({ message: "Invalid Officer registration code." });
    }
  }

  try {
    // Check if email already taken
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({ name, email, passwordHash, role });

    // Return success (no JWT — user must log in separately)
    return res.status(201).json({
      message: "Account created successfully. Please log in.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// ─── POST /api/auth/login ────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Sign JWT — expires in 8 hours (enough for a hackathon demo day)
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
});

module.exports = router;
