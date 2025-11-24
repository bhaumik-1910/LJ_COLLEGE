// // backend/routes/institution.js===================================================================
// import express from "express";
// import Institution from '../models/Institution.js';
// import { authRequired } from '../middleware/auth.js';
// import University from '../models/University.js';

// const router = express.Router();

// // Create new institution
// router.post('/', authRequired, async (req, res) => {
//     try {
//         const { university, name, courses } = req.body;

//         // Validate input
//         if (!university || !name) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'University and name are required'
//             });
//         }

//         // Check for duplicate institution
//         const existingInstitution = await Institution.findOne({
//             university,
//             name: { $regex: new RegExp(`^${name}$`, 'i') }
//         });

//         if (existingInstitution) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'An institution with this name already exists for the selected university'
//             });
//         }

//         // Create and save institution
//         const institution = new Institution({
//             university,
//             name: name.trim(),
//             courses: Array.isArray(courses)
//                 ? [...new Set(courses.map(c => c.trim()).filter(Boolean))]
//                 : []
//         });

//         const savedInstitution = await institution.save();

//         res.status(201).json({
//             success: true,
//             data: savedInstitution
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Server error'
//         });
//     }
// });


// // Get all institutions
// router.get('/', authRequired, async (req, res) => {
//     try {
//         const institutions = await Institution.find()
//             .populate('university', 'name')
//             .sort({ name: 1 });

//         res.json({
//             success: true,
//             data: institutions
//         });
//     } catch (error) {
//         console.error('Error fetching institutions:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Server error'
//         });
//     }
// });

// export default router;


import express from "express";
import Institution from '../models/Institution.js';
import { authRequired } from '../middleware/auth.js';
import University from '../models/University.js';

const router = express.Router();

/* ===================================================
   CREATE INSTITUTION
   POST /api/institutions
=================================================== */
router.post("/", authRequired, async (req, res) => {
    try {
        const { university, name, courses } = req.body;

        // Validate input
        if (!university || !name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "University and Institution name are required",
            });
        }

        // Check for duplicate (case-insensitive)
        const existingInstitution = await Institution.findOne({
            university,
            name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
        });

        if (existingInstitution) {
            return res.status(400).json({
                success: false,
                message:
                    "Institution already exists under this university",
            });
        }

        // Prepare clean courses
        const cleanedCourses = Array.isArray(courses)
            ? [...new Set(courses.map((c) => c.trim()).filter(Boolean))]
            : [];

        // Create institution
        const newInstitution = new Institution({
            university,
            name: name.trim(),
            courses: cleanedCourses,
        });

        const savedInstitution = await newInstitution.save();

        return res.status(201).json({
            success: true,
            message: "Institution created successfully",
            data: savedInstitution,
        });
    } catch (error) {
        console.log("Institution Create Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
});

/* ===================================================
   GET ALL INSTITUTIONS
   GET /api/institutions
=================================================== */
router.get("/", authRequired, async (req, res) => {
    try {
        const institutions = await Institution.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: institutions,
        });
    } catch (error) {
        console.log("Fetch Institutions Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

/* ===================================================
   GET INSTITUTION BY ID
   GET /api/institutions/:id
=================================================== */
router.get("/:id", authRequired, async (req, res) => {
    try {
        const institution = await Institution.findById(req.params.id);

        if (!institution) {
            return res.status(404).json({
                success: false,
                message: "Institution not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: institution,
        });
    } catch (error) {
        console.log("Institution Get Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

/* ===================================================
   UPDATE INSTITUTION
   PUT /api/institutions/:id
=================================================== */
router.put("/:id", authRequired, async (req, res) => {
    try {
        const { university, name, courses } = req.body;

        const cleanedCourses = Array.isArray(courses)
            ? [...new Set(courses.map((c) => c.trim()).filter(Boolean))]
            : [];

        const updated = await Institution.findByIdAndUpdate(
            req.params.id,
            {
                university,
                name: name?.trim(),
                courses: cleanedCourses,
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Institution not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Institution updated successfully",
            data: updated,
        });
    } catch (error) {
        console.log("Institution Update Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

/* ===================================================
   DELETE INSTITUTION
   DELETE /api/institutions/:id
=================================================== */
router.delete("/:id", authRequired, async (req, res) => {
    try {
        const deleted = await Institution.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Institution not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Institution deleted successfully",
        });
    } catch (error) {
        console.log("Institution Delete Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

export default router;
