import express from "express";
import { authRequired, requireAnyRole, requireRole } from "../middleware/auth.js";
import Category from "../models/Category.js";
import fs from "fs";
import path from "path";

const sanitizeName = (name) =>
    name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-_\s]/g, "")
        .replace(/\s+/g, "_");

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const router = express.Router();

// GET /api/categories
router.get("/", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
    try {
        const cats = await Category.find({ active: true }).sort({ name: 1 });
        res.json(cats);
    } catch (e) {
        res.status(500).json({ message: "Failed to fetch categories" });
    }
});

// POST /api/categories
router.post("/", authRequired, requireRole("faculty"), async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !name.trim()) return res.status(400).json({ message: "Name is required" });

        const existing = await Category.findOne({ name: name.trim() });
        if (existing) return res.status(400).json({ message: "Category already exists" });

        const cat = await Category.create({ name: name.trim(), description });
        // Create folder structure: uploads/categories/<category>/files and images
        const safe = sanitizeName(cat.name);
        const base = path.resolve("uploads", "categories", safe);
        ensureDir(path.join(base, "files"));
        ensureDir(path.join(base, "images"));

        res.status(201).json(cat);
    } catch (e) {
        res.status(500).json({ message: "Failed to create category" });
    }
});



export default router;
