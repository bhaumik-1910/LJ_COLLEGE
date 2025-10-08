import express from "express";
import Student from "../models/Student.js";
import { authRequired, requireRole } from "../middleware/auth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

//STUDENT REGISTER
router.post("/students", authRequired, requireRole("faculty"), async (req, res) => {
    try {
        const { enrolno, fullName, email, password, course, contact, gender, university, address } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const existingStudent = await Student.findOne({ $or: [{ enrolno }, { email }] });
        if (existingStudent) {
            return res.status(400).json({ message: "Student with this enrollment number or email already exists." });
        }

        // Generate a salt and hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newStudent = await Student.create({
            enrolno,
            fullName,
            email,
            password: hashedPassword,
            contact,
            gender,
            course,
            university,
            address,
            addedBy: req.user.id, // req.user.id is from your auth middleware
        });

        res.status(201).json({
            message: "Student added successfully",
            student: newStudent,
        });

    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ message: "An internal server error occurred." });
    }
});

//STUDENT LIST
router.get("/students", authRequired, requireRole("faculty"), async (req, res) => {
    try {
        // You can add a check for the user's role here
        if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden: You do not have permission to view this list." });
        }

        const students = await Student.find({}); // Fetch all students

        res.status(200).json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "An internal server error occurred." });
    }
});


// PATCH /api/faculty/students/:id - Update student details
router.patch("/students/:id", authRequired, requireRole("faculty"), async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Whitelist of fields allowed for an update
        const allowedUpdates = [
            "enrolno",
            "fullName",
            "email",
            "password",
            "course",
            "contact",
            "gender",
            "address",
            "university"
        ];

        // Create an object with only the allowed updates
        const filteredUpdates = {};
        for (const key of allowedUpdates) {
            if (updates[key] !== undefined) {
                filteredUpdates[key] = updates[key];
            }
        }

        // Find the student and update their details
        const updatedStudent = await Student.findByIdAndUpdate(id, filteredUpdates, {
            new: true, // Return the updated document
            runValidators: true, // Run schema validators on the update
        });

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found." });
        }

        res.json({
            message: "Student updated successfully.",
            student: updatedStudent,
        });

    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ message: "An internal server error occurred." });
    }
});


// DELETE /api/faculty/students/:id - Delete a student
router.delete("/students/:id", authRequired, requireRole("faculty"), async (req, res) => {
    try {
        const { id } = req.params;
        const del = await Student.findByIdAndDelete(id);
        if (!del) return res.status(404).json({ message: "User not found" });
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;