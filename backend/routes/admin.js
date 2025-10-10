import express from "express";
import User from "../models/User.js";
import University from "../models/University.js";
import { authRequired, requireRole } from "../middleware/auth.js";
import Document from "../models/Document.js";

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

// GET /api/admin/documents — list all documents (admin only)
router.get("/documents", authRequired, requireRole("admin"), async (req, res) => {
    try {
        const { limit = 100, page = 1 } = req.query;
        const l = Math.min(parseInt(limit, 10) || 100, 500);
        const p = Math.max(parseInt(page, 10) || 1, 1);
        const docs = await Document.find({})
            .sort({ createdAt: -1 })
            .skip((p - 1) * l)
            .limit(l)
            .populate({ path: "student", select: "enrolno fullName university" })
            .populate({ path: "category", select: "name" });
        const total = await Document.countDocuments({});
        res.json({ items: docs, total, page: p, limit: l });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/admin/documents/count — total documents across all universities
router.get("/documents/count", authRequired, requireRole("admin"), async (_req, res) => {
    try {
        const count = await Document.countDocuments({});
        res.json({ count });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/admin/documents/stats/monthly — monthly counts for a given year
router.get("/documents/stats/monthly", authRequired, requireRole("admin"), async (req, res) => {
    try {
        const now = new Date();
        const year = parseInt(req.query.year, 10) || now.getFullYear();
        const start = new Date(year, 0, 1);
        const end = new Date(year + 1, 0, 1);

        const agg = await Document.aggregate([
            { $match: { date: { $gte: start, $lt: end } } },
            { $group: { _id: { $month: "$date" }, count: { $sum: 1 } } },
            { $project: { month: "$_id", count: 1, _id: 0 } },
            { $sort: { month: 1 } },
        ]);

        const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }));
        for (const { month, count } of agg) months[month - 1].count = count;
        res.json({ year, months });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
