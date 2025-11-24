import express from "express";
import University from "../models/University.js";
import { sendOtpEmail } from "../utils/email.js";
import { setOtp, verifyOtp, isVerified, clearVerification } from "../utils/otpStore.js";

const router = express.Router();

// POST /api/universities/send-otp { email }
router.post("/send-otp", async (req, res) => {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: "Email is required" });
    try {
        const otp = Math.floor(100000 + Math.random() * 900000);
        setOtp(email, otp);
        await sendOtpEmail(email, otp);
        res.json({ message: "OTP sent" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Failed to send OTP" });
    }
});

// POST /api/universities/verify-otp { email, otp }
router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body || {};
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });
    const ok = verifyOtp(email, otp);
    if (!ok) return res.status(400).json({ message: "Invalid or expired OTP" });
    res.json({ message: "Verified" });
});

// POST /api/universities
router.post("/", async (req, res) => {
    try {
        const { name, email, courses } = req.body || {}; // Destructure the new 'courses' field

        if (!name || !email) {
            return res.status(400).json({ message: "Name and email required" });
        }

        if (!isVerified(email)) {
            return res.status(400).json({ message: "Email not verified via OTP" });
        }

        const exists = await University.findOne({ $or: [{ name }, { email: email.toLowerCase() }] });
        if (exists) {
            return res.status(400).json({ message: "University with same name or email exists" });
        }

        // Validate if 'courses' is an array before creating the document
        const newCourses = (Array.isArray(courses) && courses.length > 0) ? courses : [];

        // Create the new University document, including the courses array
        const uni = await University.create({ name, email, courses: newCourses });

        clearVerification(email);
        res.status(201).json(uni);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/universities
router.get("/", async (_req, res) => {
    try {
        const list = await University.find({}).sort({ name: 1 });
        res.json(list);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
