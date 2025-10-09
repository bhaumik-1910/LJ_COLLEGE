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

export default router;
