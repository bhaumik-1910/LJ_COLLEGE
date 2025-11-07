import express from "express";
import Student from "../models/Student.js";
import { authRequired, requireAnyRole, requireRole } from "../middleware/auth.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

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

// STUDENT REGISTER: force student's university to the faculty's university
router.post("/students", authRequired, requireRole("faculty"), async (req, res) => {
    try {
        const { enrolno, fullName, email, course, contact, gender, address } = req.body;

        // Basic validation
        if (!enrolno || !fullName || !email || !course || !contact || !gender || !address) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const normalizedGender = String(gender).toLowerCase();
        if (!["male", "female"].includes(normalizedGender)) {
            return res.status(400).json({ message: "Invalid gender. Allowed: male, female" });
        }

        const uni = await resolveUniversity(req);
        if (!uni) return res.status(400).json({ message: "Faculty university not set in token/profile" });

        const existingStudent = await Student.findOne({ $or: [{ enrolno }, { email }] });
        if (existingStudent) {
            return res.status(400).json({ message: "Student with this enrollment number or email already exists." });
        }

        const newStudent = await Student.create({
            enrolno,
            fullName,
            email,
            contact,
            gender: normalizedGender,
            course,
            university: uni, // critical: scope to faculty's university
            address,
            addedBy: req.user.id,
        });

        res.status(201).json({ message: "Student added successfully", student: newStudent });
    } catch (error) {
        if (error?.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        console.error("Error adding student:", error);
        res.status(500).json({ message: "An internal server error occurred." });
    }
});

//STUDENT LIST
router.get("/students", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
    try {
        const uni = await resolveUniversity(req);
        if (!uni) return res.status(400).json({ message: "Faculty university not set in token/profile" });
        const students = await Student.find({ university: uni });
        res.status(200).json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "An internal server error occurred." });
    }
});

// UPDATE (cannot change university)
router.patch("/students/:id", authRequired, requireRole("faculty"), async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const allowed = ["enrolno", "fullName", "email", "course", "contact", "gender", "address"];
        const filtered = {};
        for (const k of allowed) {
            if (updates[k] !== undefined) filtered[k] = k === "gender" ? String(updates[k]).toLowerCase() : updates[k];
        }
        if (filtered.gender && !["male", "female"].includes(filtered.gender)) {
            return res.status(400).json({ message: "Invalid gender. Allowed: male, female" });
        }

        const uni = await resolveUniversity(req);
        if (!uni) return res.status(400).json({ message: "Faculty university not set in token/profile" });

        const updatedStudent = await Student.findOneAndUpdate(
            { _id: id, university: uni },
            filtered,
            { new: true, runValidators: true }
        );
        if (!updatedStudent) return res.status(404).json({ message: "Student not found." });

        res.json({ message: "Student updated successfully.", student: updatedStudent });
    } catch (error) {
        if (error?.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        console.error("Error updating student:", error);
        res.status(500).json({ message: "An internal server error occurred." });
    }
});

// DELETE
router.delete("/students/:id", authRequired, requireRole("faculty"), async (req, res) => {
    try {
        const { id } = req.params;
        const uni = await resolveUniversity(req);
        if (!uni) return res.status(400).json({ message: "Faculty university not set in token/profile" });
        const del = await Student.findOneAndDelete({ _id: id, university: uni });
        if (!del) return res.status(404).json({ message: "User not found" });
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server error" });
    }
});

// COUNT
router.get("/students/count", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
    try {
        const uni = await resolveUniversity(req);
        if (!uni) return res.status(400).json({ message: "Faculty university not set in token/profile" });
        const count = await Student.countDocuments({ university: uni });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: "An internal server error occurred." });
    }
});

// LIST faculties in same university (admin)
router.get("/", authRequired, requireAnyRole(["admin"]), async (req, res) => {
    try {
        const uni = await resolveUniversity(req);
        if (!uni) return res.status(400).json({ message: "Faculty university not set in token/profile" });
        const users = await User.find({ role: "faculty", university: uni }).select("-password").sort({ name: 1 });
        res.json(users);
    } catch (error) {
        console.error("Error fetching faculties:", error);
        res.status(500).json({ message: "An internal server error occurred." });
    }
});

// COUNT faculties in same university (admin)
router.get("/count", authRequired, requireAnyRole(["admin"]), async (req, res) => {
    try {
        const uni = await resolveUniversity(req);
        if (!uni) return res.status(400).json({ message: "Faculty university not set in token/profile" });
        const count = await User.countDocuments({ role: "faculty", university: uni });
        res.json({ count });
    } catch (error) {
        console.error("Error counting faculties:", error);
        res.status(500).json({ message: "An internal server error occurred." });
    }
});

// PATCH /api/users/me - Update the profile of the currently logged-in user
router.patch("/me", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        // Define which fields are allowed to be updated for security
        const allowedUpdates = ["name", "email", "university", "avatarUrl"];
        const filteredUpdates = {};
        for (const key of allowedUpdates) {
            if (updates[key] !== undefined) {
                filteredUpdates[key] = updates[key];
            }
        }

        const updatedUser = await User.findByIdAndUpdate(userId, filteredUpdates, {
            new: true,
            runValidators: true,
            projection: { password: 0 }, // Exclude password from being returned
        });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "An internal server error occurred." });
    }
});


// GET /api/users/me - Fetch the profile of the currently logged-in user
router.get("/me", authRequired, requireAnyRole(["faculty", "admin"]), async (req, res) => {
    try {
        // req.user.id is set by your authentication middleware
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "An internal server error occurred." });
    }
});


export default router;