import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";

const router = express.Router();

//  Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Or your email service (e.g., "outlook", "yahoo")
  auth: {
    user: process.env.SMTP_USER, // Your email address from .env
    pass: process.env.SMTP_PASS, // Your app password from .env
  },
});

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, designation, role, university } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, designation, role, university });
    res.status(201).json({ message: "User registered successfully", role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Please fill all fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// FORGOT PASSWORD (send OTP via SMTP)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a 6-digit OTP
    const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

    // Save the OTP and its expiration time to the user's document
    user.otp = otp;
    user.otpExpires = Date.now() + 3600000; // OTP is valid for 1 hour
    await user.save();

    // Email content using Nodemailer
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Password Reset OTP",
      html: `<p>Your password reset OTP is:</p><h1>${otp}</h1><p>This OTP is valid for 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent to your email." });

  } catch (error) {
    console.error("Nodemailer error:", error);
    res.status(500).json({ message: "Failed to send OTP. Please check server logs." });
  }
});

// RESET PASSWORD (verify OTP and change password)
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    // 1. Validate incoming data
    // if (!email || !otp || !newPassword || !confirmPassword) {
    //   return res.status(400).json({ message: "All fields are required." });
    // }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // 2. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 3. Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // 4. Check for OTP expiration
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    // 5. Hash the new password and update the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.otp = undefined; // Clear the OTP for security
    user.otpExpires = undefined; // Clear the expiration timestamp
    await user.save();

    // 6. Send a success response
    res.status(200).json({ message: "Password reset successfully." });

  } catch (error) {
    // Log the full error for debugging purposes
    console.error("Error during password reset:", error);

    // Send a generic, non-descriptive error message to the client
    res.status(500).json({ message: "An internal server error occurred." });
  }
});

export default router;
