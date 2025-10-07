import express from "express";
import Student from "../models/Student.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/students", authRequired, requireRole("faculty"), async (req, res) => {
    try {
        // You can add more detailed validation here if needed
        const { enrolno, fullName, email, course, contact, gender, address } = req.body;

        const existingStudent = await Student.findOne({ $or: [{ enrolno }, { email }] });
        if (existingStudent) {
            return res.status(400).json({ message: "Student with this enrollment number or email already exists." });
        }

        const newStudent = await Student.create({
            enrolno,
            fullName,
            email,
            course,
            contact,
            gender,
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

export default router;