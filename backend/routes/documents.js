import express from "express";
import { authRequired, requireRole } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";
import Student from "../models/Student.js";
import Category from "../models/Category.js";
import Document from "../models/Document.js";

import fs from "fs";
import path from "path";

const router = express.Router();

const sanitizeName = (name) =>
    name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-_\s]/g, "")
        .replace(/\s+/g, "_");

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// GET /api/documents - List documents with optional category filter
router.get(
    "/",
    authRequired,
    requireRole("faculty"),
    async (req, res) => {
        try {
            const { categoryId, categoryName } = req.query;
            const filter = {};
            if (categoryId) filter.category = categoryId;
            else if (categoryName) filter.categoryName = categoryName;

            const docs = await Document.find(filter)
                .sort({ createdAt: -1 })
                .populate({ path: "student", select: "enrolno fullName" })
                .populate({ path: "category", select: "name" });
            res.json(docs);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Failed to fetch documents" });
        }
    }
);

// POST /api/documents - Create a document record
router.post(
    "/",
    authRequired,
    requireRole("faculty"),
    upload.fields([
        { name: "file", maxCount: 1 },
        { name: "images", maxCount: 4 },
    ]),
    async (req, res) => {
        try {
            const { enrolno, type, categoryId, categoryName, date } = req.body;
            if (!enrolno) return res.status(400).json({ message: "Student enrolno is required" });
            if (!type) return res.status(400).json({ message: "Type is required" });
            if (!date) return res.status(400).json({ message: "Date is required" });
            if (!req.files || !req.files.file || !req.files.file[0]) {
                return res.status(400).json({ message: "Document file is required" });
            }

            const student = await Student.findOne({ enrolno });
            if (!student) return res.status(404).json({ message: "Student not found" });

            let category = null;
            if (categoryId) {
                category = await Category.findById(categoryId);
            } else if (categoryName) {
                category = await Category.findOne({ name: categoryName.trim() });
                if (!category) category = await Category.create({ name: categoryName.trim() });
            }
            if (!category) return res.status(400).json({ message: "Category is required" });

            const file = req.files.file[0];
            // Prepare category-specific directories
            const safeCat = sanitizeName(category.name);
            const catBase = path.resolve("uploads", "categories", safeCat);
            const filesDir = path.join(catBase, "files");
            const imagesDir = path.join(catBase, "images");
            ensureDir(filesDir);
            ensureDir(imagesDir);

            // Move main document file to category/files
            const srcFilePath = path.resolve("uploads", "files", file.filename);
            const dstFilePath = path.join(filesDir, file.filename);
            try { fs.renameSync(srcFilePath, dstFilePath); } catch (e) { /* fallback copy */
                fs.copyFileSync(srcFilePath, dstFilePath);
                try { fs.unlinkSync(srcFilePath); } catch { }
            }
            const fileUrl = `/uploads/categories/${safeCat}/files/${file.filename}`;

            // Move images to category/images
            const movedImages = [];
            for (const img of (req.files.images || [])) {
                const srcImgPath = path.resolve("uploads", "images", img.filename);
                const dstImgPath = path.join(imagesDir, img.filename);
                try { fs.renameSync(srcImgPath, dstImgPath); } catch (e) {
                    fs.copyFileSync(srcImgPath, dstImgPath);
                    try { fs.unlinkSync(srcImgPath); } catch { }
                }
                movedImages.push(`/uploads/categories/${safeCat}/images/${img.filename}`);
            }

            const doc = await Document.create({
                student: student._id,
                studentEnrolno: student.enrolno,
                studentName: student.fullName,
                category: category._id,
                categoryName: category.name,
                type: type.trim(),
                date: new Date(date),
                fileUrl,
                fileOriginalName: file.originalname,
                images: movedImages,
                uploadedBy: req.user.id,
            });

            res.status(201).json({ message: "Document uploaded", document: doc });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Failed to create document" });
        }
    }
);

// DELETE /api/documents/:id - Delete a document
// router.delete(
//     "/:id",
//     authRequired,
//     requireRole("faculty"),
//     async (req, res) => {
//         try {
//             const { id } = req.params;
//             const doc = await Document.findById(id);
//             if (!doc) return res.status(404).json({ message: "Document not found" });

//             // Try to remove files from disk (best-effort)
//             const removeIfExists = (p) => {
//                 try {
//                     if (!p) return;
//                     const diskPath = p.startsWith("/uploads") ? path.resolve(p.replace("/uploads", "uploads")) : path.resolve(p);
//                     if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);
//                 } catch { }
//             };

//             removeIfExists(doc.fileUrl);
//             (doc.images || []).forEach((img) => removeIfExists(img));

//             await Document.findByIdAndDelete(id);
//             res.json({ success: true });
//         } catch (e) {
//             console.error(e);
//             res.status(500).json({ message: "Failed to delete document" });
//         }
//     }
// );

// DELETE /api/documents/:id - Delete a document
router.delete(
    "/:id",
    authRequired,
    requireRole("faculty"),
    async (req, res) => {
        try {
            const { id } = req.params;
            const doc = await Document.findById(id);
            if (!doc) return res.status(404).json({ message: "Document not found" });

            // Helpers
            const toDiskPath = (p) => (p && p.startsWith("/uploads")) ? path.resolve(p.replace("/uploads", "uploads")) : (p ? path.resolve(p) : "");
            const removeIfExists = (absPath) => {
                try {
                    if (absPath && fs.existsSync(absPath)) fs.unlinkSync(absPath);
                } catch { }
            };
            const removeIfEmpty = (dir) => {
                try {
                    const uploadsRoot = path.resolve("uploads");
                    let current = dir;
                    while (current && current.startsWith(uploadsRoot)) {
                        if (!fs.existsSync(current)) break;
                        const items = fs.readdirSync(current);
                        if (items.length > 0) break;
                        fs.rmdirSync(current);
                        const parent = path.dirname(current);
                        if (parent === current || parent.length < uploadsRoot.length) break;
                        current = parent;
                        // stop once we removed up to category folder or uploads root
                        if (current === uploadsRoot) break;
                    }
                } catch { }
            };

            // Remove files
            const fileDisk = toDiskPath(doc.fileUrl);
            removeIfExists(fileDisk);
            (doc.images || []).forEach((img) => removeIfExists(toDiskPath(img)));

            // Attempt to remove empty directories (files/, images/, maybe category/)
            const dirsToCheck = [];
            if (fileDisk) dirsToCheck.push(path.dirname(fileDisk));
            (doc.images || []).forEach((img) => { const d = path.dirname(toDiskPath(img)); if (d) dirsToCheck.push(d); });
            Array.from(new Set(dirsToCheck)).forEach((d) => removeIfEmpty(d));

            // Delete DB record
            await Document.findByIdAndDelete(id);
            res.json({ success: true });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Failed to delete document" });
        }
    }
);

export default router;
