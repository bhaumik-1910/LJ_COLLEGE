import express from "express";
import User from "../models/User.js";
import University from "../models/University.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const router = express.Router();

// GET /api/admin/users
router.get("/users", authRequired, requireRole("admin"), async (_req, res) => {
    try {
        const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
        res.json(users);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server error" });
    }
});

// PATCH /api/admin/users/:id
router.patch("/users/:id", authRequired, requireRole("admin"), async (req, res) => {
    try {
        const { id } = req.params;
        const allowed = ["name", "email", "role", "university", "avatarUrl"];
        const update = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined) update[key] = req.body[key];
        }
        const user = await User.findByIdAndUpdate(id, update, { new: true, projection: { password: 0 } });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE /api/admin/users/:id
router.delete("/users/:id", authRequired, requireRole("admin"), async (req, res) => {
    try {
        const { id } = req.params;
        const del = await User.findByIdAndDelete(id);
        if (!del) return res.status(404).json({ message: "User not found" });
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/admin/universities
router.get("/universities", authRequired, requireRole("admin"), async (_req, res) => {
    try {
        const unis = await University.find({}).sort({ name: 1 });
        res.json(unis);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
