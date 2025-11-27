import express from "express";
import { authRequired, requireAnyRole, requireRole } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";
// import Student from "../models/Student.js";
import Category from "../models/Category.js";
import Document from "../models/Document.js";
import User from "../models/User.js";

import fs from "fs";
import path from "path";
import University from "../models/University.js";
import Institution from "../models/Institution.js";

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

// Resolve faculty university from JWT payload or DB fallback
const resolveUniversity = async (req) => {
    if (req?.user?.university) return req.user.university;
    try {
        const u = await User.findById(req.user.id).select("university");
        return u?.university || null;
    } catch {
        return null;
    }
};


// GET /api/documents 
// router.get("/", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
//     try {
//         const { categoryId, categoryName } = req.query;
//         const uni = await resolveUniversity(req);
//         if (!uni) return res.status(400).json({ message: "Faculty university not set in token/profile" });

//         const studentIds = await Student.find({ university: uni }).select("_id");
//         const filter = { student: { $in: studentIds.map(s => s._id) } };

//         if (categoryId) filter.category = categoryId;
//         else if (categoryName) filter.categoryName = categoryName;

//         const docs = await Document.find(filter)
//             .sort({ createdAt: -1 })
//             .populate({ path: "student", select: "enrolno fullName" })
//             .populate({ path: "category", select: "name" });

//         res.json(docs);
//     } catch (e) {
//         res.status(500).json({ message: "Failed to fetch documents" });
//     }
// });
// In your backend route (documents.js)
router.get("/", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
    try {
        const { categoryId, categoryName } = req.query;

        // Build filter object
        const filter = {};

        if (categoryId) filter.category = categoryId;
        if (categoryName) filter.categoryName = categoryName;

        // Find documents
        const docs = await Document.find(filter)
            .sort({ createdAt: -1 })
            .populate({ path: "category", select: "name" })
            .populate({ path: "uploadedBy", select: "fullName email" });

        res.json(docs);
    } catch (e) {
        console.error("Document fetch error:", e);
        res.status(500).json({ message: "Failed to fetch documents" });
    }
}
);



// POST /api/documents — verify student's university
// router.post("/", authRequired, requireRole("faculty"),
//     upload.fields([
//         { name: "file", maxCount: 1 },
//         { name: "images", maxCount: 4 },
//     ]),
//     async (req, res) => {
//         try {
//             const { university, universityName, institute, course, type, categoryId, categoryName, date } = req.body;
//             if (!universityName) return res.status(400).json({ message: "University is required" });
//             if (!institute) return res.status(400).json({ message: "Institute is required" });
//             if (!course) return res.status(400).json({ message: "Course is required" });
//             if (!type) return res.status(400).json({ message: "Type is required" });
//             if (!date) return res.status(400).json({ message: "Date is required" });
//             if (!req.files || !req.files.file || !req.files.file[0]) {
//                 return res.status(400).json({ message: "Document file is required" });
//             }

//             // const student = await Student.findOne({ enrolno });
//             // if (!student) return res.status(404).json({ message: "Student not found" });

//             let category = null;
//             if (categoryId) {
//                 category = await Category.findById(categoryId);
//             } else if (categoryName) {
//                 category = await Category.findOne({ name: categoryName.trim() });
//                 if (!category) category = await Category.create({ name: categoryName.trim() });
//             }
//             if (!category) return res.status(400).json({ message: "Category is required" });

//             const file = req.files.file[0];
//             // Prepare category-specific directories
//             const safeCat = sanitizeName(category.name);
//             const catBase = path.resolve("uploads", "categories", safeCat);
//             const filesDir = path.join(catBase, "files");
//             const imagesDir = path.join(catBase, "images");
//             ensureDir(filesDir);
//             ensureDir(imagesDir);

//             // Move main document file to category/files
//             const srcFilePath = path.resolve("uploads", "files", file.filename);
//             const dstFilePath = path.join(filesDir, file.filename);
//             try { fs.renameSync(srcFilePath, dstFilePath); } catch (e) { /* fallback copy */
//                 fs.copyFileSync(srcFilePath, dstFilePath);
//                 try { fs.unlinkSync(srcFilePath); } catch { }
//             }
//             const fileUrl = `/uploads/categories/${safeCat}/files/${file.filename}`;

//             // Move images to category/images
//             const movedImages = [];
//             for (const img of (req.files.images || [])) {
//                 const srcImgPath = path.resolve("uploads", "images", img.filename);
//                 const dstImgPath = path.join(imagesDir, img.filename);
//                 try { fs.renameSync(srcImgPath, dstImgPath); } catch (e) {
//                     fs.copyFileSync(srcImgPath, dstImgPath);
//                     try { fs.unlinkSync(srcImgPath); } catch { }
//                 }
//                 movedImages.push(`/uploads/categories/${safeCat}/images/${img.filename}`);
//             }

//             const instituteDoc = await Institution.findById(institute).select("name");
//             if (!instituteDoc) {
//                 return res.status(400).json({ message: "Institute not found" });
//             }
//             const instituteName = instituteDoc.name;

//             const doc = await Document.create({
//                 university: university,
//                 universityName: universityName,
//                 institute: institute,
//                 instituteName: instituteName,
//                 course: course,
//                 category: category._id,
//                 categoryName: category.name,
//                 type: type.trim(),
//                 date: new Date(date),
//                 fileUrl,
//                 fileOriginalName: file.originalname,
//                 images: movedImages,
//                 uploadedBy: req.user.id,
//             });

//             res.status(201).json({ message: "Document uploaded", document: doc });
//         } catch (e) {
//             console.error(e);
//             res.status(500).json({ message: "Failed to create document" });
//         }
//     }
// );

router.post("/", authRequired, requireRole("faculty"),
    upload.fields([
        { name: "file", maxCount: 1 },
        { name: "images", maxCount: 4 },
    ]),
    async (req, res) => {

        try {
            const { university, institute, course, type, categoryId, categoryName, date } = req.body;

            if (!university) return res.status(400).json({ message: "University is required" });
            if (!institute) return res.status(400).json({ message: "Institute is required" });
            if (!course) return res.status(400).json({ message: "Course is required" });
            if (!type) return res.status(400).json({ message: "Type is required" });
            if (!date) return res.status(400).json({ message: "Date is required" });
            if (!req.files?.file?.[0]) {
                return res.status(400).json({ message: "Document file is required" });
            }

            // ---------- GET UNIVERSITY NAME ----------
            const uniDoc = await University.findById(university).select("name");
            if (!uniDoc) return res.status(404).json({ message: "University not found" });

            // ---------- GET INSTITUTE NAME ----------
            const instDoc = await Institution.findById(institute).select("name");
            if (!instDoc) return res.status(404).json({ message: "Institute not found" });

            // ---------- CATEGORY ----------
            let category = null;
            if (categoryId) {
                category = await Category.findById(categoryId);
            } else if (categoryName) {
                category = await Category.findOne({ name: categoryName.trim() });
                if (!category) category = await Category.create({ name: categoryName.trim() });
            }
            if (!category) return res.status(400).json({ message: "Category is required" });

            // ---------- FILE MOVE ----------
            const file = req.files.file[0];
            const safeCat = sanitizeName(category.name);
            const catBase = path.resolve("uploads", "categories", safeCat);

            ensureDir(`${catBase}/files`);
            ensureDir(`${catBase}/images`);

            const srcFilePath = path.resolve("uploads/files", file.filename);
            const dstFilePath = path.join(catBase, "files", file.filename);

            fs.renameSync(srcFilePath, dstFilePath);

            const fileUrl = `/uploads/categories/${safeCat}/files/${file.filename}`;

            // ---------- IMAGES MOVE ----------
            const movedImages = [];
            for (const img of req.files.images || []) {
                const srcImg = path.resolve("uploads/images", img.filename);
                const dstImg = path.join(catBase, "images", img.filename);

                fs.renameSync(srcImg, dstImg);
                movedImages.push(`/uploads/categories/${safeCat}/images/${img.filename}`);
            }

            // ---------- CREATE DOCUMENT ----------
            const doc = await Document.create({
                university: uniDoc._id,
                universityName: uniDoc.name,

                institute: instDoc._id,
                instituteName: instDoc.name,

                course,
                category: category._id,
                categoryName: category.name,
                type,
                date: new Date(date),
                fileUrl,
                fileOriginalName: file.originalname,
                images: movedImages,
                uploadedBy: req.user.id,
            });

            res.status(201).json({ message: "Document uploaded", document: doc });

        } catch (error) {
            console.error("Document Upload Error:", error);
            res.status(500).json({ message: "Failed to create document" });
        }
    }
);


// DELETE /api/documents/:id — verify university before delete
// router.delete("/:id", authRequired, requireRole("faculty"), async (req, res) => {
//     try {
//         const { id } = req.params;
//         const doc = await Document.findById(id).populate({ path: "student", select: "university" });
//         if (!doc) return res.status(404).json({ message: "Document not found" });

//         const uni = await resolveUniversity(req);
//         if (!uni) return res.status(400).json({ message: "Faculty university not set in token/profile" });

//         if (!doc.student || doc.student.university !== uni) {
//             return res.status(403).json({ message: "Forbidden: Cannot delete other university's document" });
//         }

//         // Helpers
//         const toDiskPath = (p) => (p && p.startsWith("/uploads")) ? path.resolve(p.replace("/uploads", "uploads")) : (p ? path.resolve(p) : "");
//         const removeIfExists = (absPath) => {
//             try {
//                 if (absPath && fs.existsSync(absPath)) fs.unlinkSync(absPath);
//             } catch { }
//         };
//         const removeIfEmpty = (dir) => {
//             try {
//                 const uploadsRoot = path.resolve("uploads");
//                 let current = dir;
//                 while (current && current.startsWith(uploadsRoot)) {
//                     if (!fs.existsSync(current)) break;
//                     const items = fs.readdirSync(current);
//                     if (items.length > 0) break;
//                     fs.rmdirSync(current);
//                     const parent = path.dirname(current);
//                     if (parent === current || parent.length < uploadsRoot.length) break;
//                     current = parent;
//                     // stop once we removed up to category folder or uploads root
//                     if (current === uploadsRoot) break;
//                 }
//             } catch { }
//         };

//         // Remove files
//         const fileDisk = toDiskPath(doc.fileUrl);
//         removeIfExists(fileDisk);
//         (doc.images || []).forEach((img) => removeIfExists(toDiskPath(img)));

//         // Attempt to remove empty directories (files/, images/, maybe category/)
//         const dirsToCheck = [];
//         if (fileDisk) dirsToCheck.push(path.dirname(fileDisk));
//         (doc.images || []).forEach((img) => { const d = path.dirname(toDiskPath(img)); if (d) dirsToCheck.push(d); });
//         Array.from(new Set(dirsToCheck)).forEach((d) => removeIfEmpty(d));

//         // Delete DB record
//         await Document.findByIdAndDelete(id);
//         res.json({ success: true });
//     } catch (e) {
//         console.error(e);
//         res.status(500).json({ message: "Failed to delete document" });
//     }
// }
// );
router.delete("/:id", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
    try {
        const { id } = req.params;

        // Find document
        const doc = await Document.findById(id);
        if (!doc) {
            return res.status(404).json({ message: "Document not found" });
        }

        // Helper: Convert URL to absolute disk path
        const toDiskPath = (p) => {
            if (!p) return "";
            if (p.startsWith("/uploads")) {
                return path.resolve("uploads" + p.replace("/uploads", ""));
            }
            return path.resolve(p);
        };

        // Helper: Delete file if exists
        const removeIfExists = (absPath) => {
            try {
                if (absPath && fs.existsSync(absPath)) {
                    fs.unlinkSync(absPath);
                }
            } catch (err) {
                console.error("File delete failed:", err);
            }
        };

        // Helper: Remove parent dirs if empty
        const removeIfEmpty = (dir) => {
            try {
                const root = path.resolve("uploads");
                let current = dir;

                while (current.startsWith(root)) {
                    if (!fs.existsSync(current)) break;
                    if (fs.readdirSync(current).length > 0) break;

                    fs.rmdirSync(current);
                    const parent = path.dirname(current);
                    if (parent === current) break;
                    current = parent;

                    if (current === root) break;
                }
            } catch (err) {
                console.error("Remove empty dir failed:", err);
            }
        };

        //Delete main file
        const fileDisk = toDiskPath(doc.fileUrl);
        removeIfExists(fileDisk);

        //Delete images
        const imageDirs = [];
        (doc.images || []).forEach((img) => {
            const abs = toDiskPath(img);
            removeIfExists(abs);
            imageDirs.push(path.dirname(abs));
        });

        // Remove empty folders (files/, images/, category/)
        const dirsToCheck = [path.dirname(fileDisk), ...imageDirs];
        Array.from(new Set(dirsToCheck)).forEach((dir) => removeIfEmpty(dir));

        // Remove from DB
        await Document.findByIdAndDelete(id);

        return res.json({ success: true, message: "Document deleted successfully" });

    } catch (err) {
        console.error("Delete error:", err);
        return res.status(500).json({ message: "Failed to delete document" });
    }
});

// GET /api/documents/count — scoped to university
// router.get("/count", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
//     try {
//         const uni = await resolveUniversity(req);
//         if (!uni) return res.status(400).json({ message: "Faculty university not set in token/profile" });

//         const studentIds = await Student.find({ university: uni }).select("_id");
//         const count = await Document.countDocuments({ student: { $in: studentIds.map(s => s._id) } });
//         res.json({ count });
//     } catch {
//         res.status(500).json({ message: "Failed to fetch document count" });
//     }
// });
router.get("/count", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
    try {
        const uni = await resolveUniversity(req);
        if (!uni) return res.status(400).json({ message: "Faculty university not set" });

        const count = await Document.countDocuments({ university: uni });
        res.json({ count });
    } catch (e) {
        res.status(500).json({ message: "Failed to fetch document count" });
    }
});


// GET /api/documents/stats/monthly — scoped to university
router.get("/stats/monthly", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
    try {
        const now = new Date();
        const year = parseInt(req.query.year, 10) || now.getFullYear();
        const start = new Date(year, 0, 1);
        const end = new Date(year + 1, 0, 1);

        const uni = await resolveUniversity(req);
        if (!uni) return res.status(400).json({ message: "Faculty university not set in token/profile" });

        // const studentIds = await Student.find({ university: uni }).select("_id");
        // const ids = studentIds.map(s => s._id);

        const agg = await Document.aggregate([
            { $match: { date: { $gte: start, $lt: end }, university: uni } },
            { $group: { _id: { $month: "$date" }, count: { $sum: 1 } } },
            { $project: { month: "$_id", count: 1, _id: 0 } },
            { $sort: { month: 1 } },
        ]);

        const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }));
        for (const { month, count } of agg) months[month - 1].count = count;
        res.json({ year, months });
    } catch {
        res.status(500).json({ message: "Failed to fetch monthly stats" });
    }
});

export default router;
