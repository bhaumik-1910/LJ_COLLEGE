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

import mongoose from 'mongoose';

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
// const resolveUniversity = async (req) => {
//     if (req?.user?.university)
//         return req.user.university;
//     try {
//         const u = await User.findById(req.user.id).select("university");
//         return u?.university || null;
//     } catch {
//         return null;
//     }
// };
const resolveUniversity = async (req) => {
    try {
        // If we have a direct university ID in the user object
        if (req?.user?.university && mongoose.Types.ObjectId.isValid(req.user.university)) {
            return req.user.university;
        }

        // If we have a university name in the user object
        if (req?.user?.university) {
            const uni = await University.findOne({ name: req.user.university }).select('_id');
            return uni?._id?.toString() || null;
        }

        // If no university in user object, try to get it from the user document
        const user = await User.findById(req.user.id).select("university");
        if (!user?.university) return null;

        if (mongoose.Types.ObjectId.isValid(user.university)) {
            return user.university;
        }

        // If university is stored as a name in the user document
        const uni = await University.findOne({ name: user.university }).select('_id');
        return uni?._id?.toString() || null;

    } catch (error) {
        console.error('Error resolving university:', error);
        return null;
    }
};



// GET /api/documents 
router.get("/", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
    try {
        // Get the user's university ID from the authenticated user
        const userUniversityId = await resolveUniversity(req);

        if (!userUniversityId) {
            return res.status(400).json({
                success: false,
                message: "User's university not found"
            });
        }

        // Verify the university exists (optional but good practice)
        const universityExists = await University.exists({ _id: userUniversityId });
        if (!universityExists) {
            return res.status(404).json({
                success: false,
                message: "University not found in database"
            });
        }

        const filter = { university: userUniversityId };

        // categoryId filter
        if (req.query.categoryId) {
            filter.category = new mongoose.Types.ObjectId(req.query.categoryId);
        }

        // categoryName filter (optional)
        if (req.query.categoryName) {
            filter.categoryName = req.query.categoryName;
        }

        // TYPE FILTER 
        if (req.query.type) {
            filter.type = req.query.type;
        }

        // SUB CATEGORY FILTER 
        if (req.query.subCategory) {
            filter.subCategory = req.query.subCategory;
        }


        // Find documents using the university ID
        const docs = await Document.find(filter)
            .sort({ createdAt: -1 })
            .populate('category', 'name')
            .populate('uploadedBy', 'name email')
            .populate('university', 'name');

        res.json({
            success: true,
            data: docs
        });
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch documents",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// In documents.js proepr data ave che aa ma 
// router.get("/", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
//     try {
//         // For testing only - show all documents
//         const docs = await Document.find()
//             .sort({ createdAt: -1 })
//             .populate('category', 'name')
//             .populate('uploadedBy', 'name email')
//             .populate('university', 'name');

//         res.json(docs);
//     } catch (error) {
//         console.error('Error fetching documents:', error);
//         res.status(500).json({ message: "Failed to fetch documents" });
//     }
// });



// POST /api/documents — verify Document's university

//Proper Chale che 
// router.post("/", authRequired, requireRole("faculty"),
//     upload.fields([
//         { name: "file", maxCount: 1 },
//         { name: "images", maxCount: 4 },
//     ]),
//     async (req, res) => {

//         try {
//             const { university, institute, course, type, categoryId, categoryName, date } = req.body;

//             if (!university) return res.status(400).json({ message: "University is required" });
//             if (!institute) return res.status(400).json({ message: "Institute is required" });
//             if (!course) return res.status(400).json({ message: "Course is required" });
//             if (!type) return res.status(400).json({ message: "Type is required" });
//             if (!date) return res.status(400).json({ message: "Date is required" });
//             if (!req.files?.file?.[0]) {
//                 return res.status(400).json({ message: "Document file is required" });
//             }

//             // ---------- GET UNIVERSITY NAME ----------
//             const uniDoc = await University.findById(university).select("name");
//             if (!uniDoc) return res.status(404).json({ message: "University not found" });

//             // ---------- GET INSTITUTE NAME ----------
//             const instDoc = await Institution.findById(institute).select("name");
//             if (!instDoc) return res.status(404).json({ message: "Institute not found" });

//             // ---------- CATEGORY ----------
//             let category = null;
//             if (categoryId) {
//                 category = await Category.findById(categoryId);
//             } else if (categoryName) {
//                 category = await Category.findOne({ name: categoryName.trim() });
//                 if (!category) category = await Category.create({ name: categoryName.trim() });
//             }
//             if (!category) return res.status(400).json({ message: "Category is required" });

//             // ---------- FILE MOVE ----------
//             const file = req.files.file[0];
//             const safeCat = sanitizeName(category.name);
//             const catBase = path.resolve("uploads", "categories", safeCat);

//             ensureDir(`${catBase}/files`);
//             ensureDir(`${catBase}/images`);

//             const srcFilePath = path.resolve("uploads/files", file.filename);
//             const dstFilePath = path.join(catBase, "files", file.filename);

//             fs.renameSync(srcFilePath, dstFilePath);

//             const fileUrl = `/uploads/categories/${safeCat}/files/${file.filename}`;

//             // ---------- IMAGES MOVE ----------
//             const movedImages = [];
//             for (const img of req.files.images || []) {
//                 const srcImg = path.resolve("uploads/images", img.filename);
//                 const dstImg = path.join(catBase, "images", img.filename);

//                 fs.renameSync(srcImg, dstImg);
//                 movedImages.push(`/uploads/categories/${safeCat}/images/${img.filename}`);
//             }

//             // ---------- CREATE DOCUMENT ----------
//             const doc = await Document.create({
//                 university: uniDoc._id,
//                 universityName: uniDoc.name,

//                 institute: instDoc._id,
//                 instituteName: instDoc.name,

//                 course,
//                 category: category._id,
//                 categoryName: category.name,
//                 type,
//                 date: new Date(date),
//                 fileUrl,
//                 fileOriginalName: file.originalname,
//                 images: movedImages,
//                 uploadedBy: req.user.id,
//             });

//             res.status(201).json({ message: "Document uploaded", document: doc });

//         } catch (error) {
//             console.error("Document Upload Error:", error);
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
            const { university, institute, course, type, categoryId, categoryName, subCategory, date } = req.body;

            // validations
            if (!university) return res.status(400).json({ message: "University is required" });
            if (!institute) return res.status(400).json({ message: "Institute is required" });
            if (!course) return res.status(400).json({ message: "Course is required" });
            if (!type) return res.status(400).json({ message: "Type is required" });
            if (!date) return res.status(400).json({ message: "Date is required" });
            if (!req.files?.file?.[0]) {
                return res.status(400).json({ message: "Document file is required" });
            }

            // Get university name
            const uniDoc = await University.findById(university).select("name");
            if (!uniDoc) return res.status(404).json({ message: "University not found" });

            // Get institute name
            const instDoc = await Institution.findById(institute).select("name");
            if (!instDoc) return res.status(404).json({ message: "Institute not found" });

            // Category
            let category = null;
            if (categoryId) {
                category = await Category.findById(categoryId);
            } else if (categoryName) {
                category = await Category.findOne({ name: categoryName.trim() });
                if (!category) category = await Category.create({ name: categoryName.trim() });
            }
            if (!category) return res.status(400).json({ message: "Category is required" });
            // CATEGORY FROM DROPDOWN ONLY (NO AUTO CREATE)
            // if (!categoryId) {
            //     return res.status(400).json({ message: "Category is required" });
            // }

            // const category = await Category.findOne({
            //     _id: categoryId,
            //     university: university,   // ensure same university
            //     active: true
            // });

            // if (!category) {
            //     return res.status(404).json({ message: "Invalid category for this university" });
            // }


            // -----------------------------
            //  SANITIZE NAMES FOR FOLDERS
            // -----------------------------
            const uniSafe = sanitizeName(uniDoc.name);
            const instSafe = sanitizeName(instDoc.name);
            const courseSafe = sanitizeName(course);
            const catSafe = sanitizeName(category.name);

            // -----------------------------
            //  FINAL PATH : /uni/inst/course/category
            // -----------------------------
            // const basePath = path.resolve("uploads", uniSafe, instSafe, courseSafe, catSafe);

            const basePath = path.resolve("D:/DocumentStorage", uniSafe, instSafe, courseSafe, catSafe);

            ensureDir(path.join(basePath, "files"));
            ensureDir(path.join(basePath, "images"));

            // -----------------------------
            //  MOVE MAIN FILE
            // -----------------------------
            const file = req.files.file[0];
            const srcFilePath = path.resolve("uploads/files", file.filename);
            const dstFilePath = path.join(basePath, "files", file.filename);

            fs.renameSync(srcFilePath, dstFilePath);

            const fileUrl = `/uploads/${uniSafe}/${instSafe}/${courseSafe}/${catSafe}/files/${file.filename}`;

            // -----------------------------
            //  MOVE IMAGES
            // -----------------------------
            const movedImages = [];
            for (const img of req.files.images || []) {
                const srcImg = path.resolve("uploads/images", img.filename);
                const dstImg = path.join(basePath, "images", img.filename);

                fs.renameSync(srcImg, dstImg);

                movedImages.push(
                    `/uploads/${uniSafe}/${instSafe}/${courseSafe}/${catSafe}/images/${img.filename}`
                );
            }

            // -----------------------------
            //  CREATE DOCUMENT
            // -----------------------------
            const doc = await Document.create({
                university: uniDoc._id,
                universityName: uniDoc.name,

                institute: instDoc._id,
                instituteName: instDoc.name,

                course,

                category: category._id,
                categoryName: category.name,

                subCategory: subCategory || "",

                type,
                // date: new Date(date),
                date: new Date(),   //Always today's date from server

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
//Proper to the delete
// router.delete("/:id", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Find document
//         const doc = await Document.findById(id);
//         if (!doc) {
//             return res.status(404).json({ message: "Document not found" });
//         }

//         // Helper: Convert URL to absolute disk path
//         const toDiskPath = (p) => {
//             if (!p) return "";
//             if (p.startsWith("/uploads")) {
//                 return path.resolve("uploads" + p.replace("/uploads", ""));
//             }
//             return path.resolve(p);
//         };

//         // Helper: Delete file if exists
//         const removeIfExists = (absPath) => {
//             try {
//                 if (absPath && fs.existsSync(absPath)) {
//                     fs.unlinkSync(absPath);
//                 }
//             } catch (err) {
//                 console.error("File delete failed:", err);
//             }
//         };

//         // Helper: Remove parent dirs if empty
//         const removeIfEmpty = (dir) => {
//             try {
//                 const root = path.resolve("uploads");
//                 let current = dir;

//                 while (current.startsWith(root)) {
//                     if (!fs.existsSync(current)) break;
//                     if (fs.readdirSync(current).length > 0) break;

//                     fs.rmdirSync(current);
//                     const parent = path.dirname(current);
//                     if (parent === current) break;
//                     current = parent;

//                     if (current === root) break;
//                 }
//             } catch (err) {
//                 console.error("Remove empty dir failed:", err);
//             }
//         };

//         //Delete main file
//         const fileDisk = toDiskPath(doc.fileUrl);
//         removeIfExists(fileDisk);

//         //Delete images
//         const imageDirs = [];
//         (doc.images || []).forEach((img) => {
//             const abs = toDiskPath(img);
//             removeIfExists(abs);
//             imageDirs.push(path.dirname(abs));
//         });

//         // Remove empty folders (files/, images/, category/)
//         const dirsToCheck = [path.dirname(fileDisk), ...imageDirs];
//         Array.from(new Set(dirsToCheck)).forEach((dir) => removeIfEmpty(dir));

//         // Remove from DB
//         await Document.findByIdAndDelete(id);

//         return res.json({ success: true, message: "Document deleted successfully" });

//     } catch (err) {
//         console.error("Delete error:", err);
//         return res.status(500).json({ message: "Failed to delete document" });
//     }
// });
router.delete("/:id", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
    try {
        const { id } = req.params;

        //  Find document
        const doc = await Document.findById(id);
        if (!doc) {
            return res.status(404).json({ message: "Document not found" });
        }

        //  BASE STORAGE ROOT (D Drive)
        const STORAGE_ROOT = "D:/DocumentStorage";

        //  Convert public URL to disk path
        const toDiskPath = (p) => {
            if (!p) return "";
            if (p.startsWith("/uploads")) {
                return path.join(
                    STORAGE_ROOT,
                    p.replace("/uploads/", "")
                );
            }
            return path.resolve(p);
        };

        //  Safe delete file
        const removeIfExists = (absPath) => {
            try {
                if (absPath && fs.existsSync(absPath)) {
                    fs.unlinkSync(absPath);
                }
            } catch (err) {
                console.error("File delete failed:", err);
            }
        };

        //  Remove empty parent directories safely
        const removeIfEmpty = (dir) => {
            try {
                let current = dir;

                while (current.startsWith(STORAGE_ROOT)) {
                    if (!fs.existsSync(current)) break;
                    if (fs.readdirSync(current).length > 0) break;

                    fs.rmdirSync(current);
                    current = path.dirname(current);
                }

            } catch (err) {
                console.error("Remove empty dir failed:", err);
            }
        };

        //  DELETE MAIN FILE
        const fileDisk = toDiskPath(doc.fileUrl);
        removeIfExists(fileDisk);

        //  DELETE IMAGES
        const imageDirs = [];
        (doc.images || []).forEach((img) => {
            const abs = toDiskPath(img);
            removeIfExists(abs);
            imageDirs.push(path.dirname(abs));
        });

        //  CLEAN EMPTY FOLDERS
        const dirsToCheck = [path.dirname(fileDisk), ...imageDirs];
        Array.from(new Set(dirsToCheck)).forEach((dir) => removeIfEmpty(dir));

        //  DELETE FROM DATABASE
        await Document.findByIdAndDelete(id);

        return res.json({
            success: true,
            message: "Document deleted successfully from DB & D Drive"
        });

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
// router.get("/count", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
//     try {
//         const uni = await resolveUniversity(req);

//         if (!uni) {
//             return res.status(400).json({
//                 message: "University for user not found or not assigned"
//             });
//         }

//         const count = await Document.countDocuments({ university: uni });
//         res.json({ count });
//     } catch {
//         res.status(500).json({ message: "Failed to fetch document count" });
//     }
// });
// router.get("/count", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
//     try {
//         const user = await User.findById(req.user.id)
//             .select('university')
//             .populate('university', '_id name');

//         const filter = user?.university?.name
//             ? { university: user.university._id }
//             : {};

//         const count = await Document.countDocuments(filter);
//         res.json({ count });
//     } catch (error) {
//         console.error('Error getting document count:', error);
//         res.status(500).json({
//             message: "Failed to get document count",
//             error: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// });
router.get("/count", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
    try {
        // Get the user's university ID
        const userUniversityId = await resolveUniversity(req);

        if (!userUniversityId) {
            return res.status(400).json({
                success: false,
                message: "User's university not found"
            });
        }

        // Verify the university exists
        const universityExists = await University.exists({ _id: userUniversityId });
        if (!universityExists) {
            return res.status(404).json({
                success: false,
                message: "University not found in database"
            });
        }

        // Count documents for the specific university
        const count = await Document.countDocuments({
            university: userUniversityId
        });

        res.json({
            success: true,
            count,
            universityId: userUniversityId
        });

    } catch (error) {
        console.error('Error getting document count:', error);
        res.status(500).json({
            success: false,
            message: "Failed to get document count",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
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


//Categoty Fetch to 
router.get("/categories", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
    try {
        const userUniversityId = await resolveUniversity(req);

        if (!userUniversityId) {
            return res.status(400).json({ message: "University not found for user" });
        }

        const categories = await Document.aggregate([
            {
                $match: {
                    university: new mongoose.Types.ObjectId(userUniversityId)
                }
            },
            {
                $group: {
                    _id: "$category",
                    name: { $first: "$categoryName" }
                }
            },
            {
                $sort: { name: 1 }
            }
        ]);

        res.json(categories);
    } catch (err) {
        console.error("Fetch Categories From Document Error:", err);
        res.status(500).json({ message: "Failed to fetch categories" });
    }
});


//fatch Type so 
// router.get("/types", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
//     try {
//         const types = await Document.distinct("type");
//         res.json(types.filter(t => t));
//     } catch (err) {
//         res.status(500).json({ message: "Failed to fetch types" });
//     }
// });
router.get("/types", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
    try {
        const userUniversityId = await resolveUniversity(req);

        if (!userUniversityId) {
            return res.status(400).json({ message: "University not found for user" });
        }

        const types = await Document.distinct("type", {
            university: userUniversityId,
        });

        res.json(types.filter(t => t)); // remove empty values

    } catch (err) {
        console.error("Fetch Types Error:", err);
        res.status(500).json({ message: "Failed to fetch types" });
    }
});


//Fetch sub categoty
// router.get("/subcategories", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
//     try {
//         const subs = await Document.distinct("subCategory");
//         res.json(subs.filter(s => s));   // empty remove
//     } catch (err) {
//         res.status(500).json({ message: "Failed to fetch sub categories" });
//     }
// });
router.get("/subcategories", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
    try {
        const userUniversityId = await resolveUniversity(req);

        if (!userUniversityId) {
            return res.status(400).json({ message: "University not found for user" });
        }

        const subs = await Document.distinct("subCategory", {
            university: userUniversityId,
        });

        res.json(subs.filter(s => s)); // remove empty values

    } catch (err) {
        console.error("Fetch SubCategory Error:", err);
        res.status(500).json({ message: "Failed to fetch sub categories" });
    }
});



export default router;
