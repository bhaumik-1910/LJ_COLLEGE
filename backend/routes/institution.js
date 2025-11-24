// // backend/routes/institution.js
// const express = require('express');
// const Institution = require('../models/Institution');
// const University = require('../models/University');
// import { authRequired, requireAnyRole, requireRole } from "../middleware/auth.js";

// const router = express.Router();

// // Get all institutions with university details
// router.get('/', authRequired, async (req, res) => {
//     try {
//         const institutions = await Institution.find()
//             .populate('university', 'name')
//             .sort({ name: 1 });
//         res.json(institutions);
//     } catch (error) {
//         console.error('Error fetching institutions:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // Create a new institution
// router.post('/', authRequired, requireRole("superadmin"), async (req, res) => {
//     try {
//         const { name, university, courses } = req.body;

//         // Validate input
//         if (!name || !university) {
//             return res.status(400).json({ message: 'Name and university are required' });
//         }

//         // Check if university exists
//         const universityExists = await University.findById(university);
//         if (!universityExists) {
//             return res.status(400).json({ message: 'University not found' });
//         }

//         // Check for duplicate institution name in the same university (case insensitive)
//         const existingInstitution = await Institution.findOne({
//             name: { $regex: new RegExp(`^${name}$`, 'i') },
//             university
//         });

//         if (existingInstitution) {
//             return res.status(400).json({
//                 message: 'An institution with this name already exists in the selected university'
//             });
//         }

//         // Create new institution
//         const institution = new Institution({
//             name,
//             university,
//             courses: courses ? courses.filter(course => course && course.trim() !== '') : []
//         });

//         const newInstitution = await institution.save();
//         res.status(201).json(await newInstitution.populate('university', 'name'));
//     } catch (error) {
//         console.error('Error creating institution:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // Update an institution
// router.put('/:id', authRequired, requireRole("superadmin"), async (req, res) => {
//     try {
//         const { name, university, courses } = req.body;

//         // Check if institution exists
//         let institution = await Institution.findById(req.params.id);
//         if (!institution) {
//             return res.status(404).json({ message: 'Institution not found' });
//         }

//         // Check if university exists
//         const universityExists = await University.findById(university);
//         if (!universityExists) {
//             return res.status(400).json({ message: 'University not found' });
//         }

//         // Check for duplicate institution name in the same university (case insensitive)
//         const existingInstitution = await Institution.findOne({
//             _id: { $ne: req.params.id },
//             name: { $regex: new RegExp(`^${name}$`, 'i') },
//             university
//         });

//         if (existingInstitution) {
//             return res.status(400).json({
//                 message: 'An institution with this name already exists in the selected university'
//             });
//         }

//         // Update institution
//         institution.name = name;
//         institution.university = university;
//         institution.courses = courses ? courses.filter(course => course && course.trim() !== '') : [];

//         const updatedInstitution = await institution.save();
//         res.json(await updatedInstitution.populate('university', 'name'));
//     } catch (error) {
//         console.error('Error updating institution:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // Delete an institution
// router.delete('/:id', authRequired, requireRole("superadmin"), async (req, res) => {
//     try {
//         const institution = await Institution.findByIdAndDelete(req.params.id);
//         if (!institution) {
//             return res.status(404).json({ message: 'Institution not found' });
//         }
//         res.json({ message: 'Institution deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting institution:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// module.exports = router;


import express from "express";  
import Institution from '../models/Institution.js';
import University from '../models/University.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// Create a new institution
router.post('/', authRequired, async (req, res) => {
    try {
        const { name, university, courses } = req.body;

        // Validate input
        if (!name || !university) {
            return res.status(400).json({ message: 'Name and university are required' });
        }

        // Check if university exists
        const universityExists = await University.findById(university);
        if (!universityExists) {
            return res.status(400).json({ message: 'University not found' });
        }

        // Check for duplicate institution name in the same university
        const existingInstitution = await Institution.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            university
        });

        if (existingInstitution) {
            return res.status(400).json({
                message: 'An institution with this name already exists in the selected university'
            });
        }

        // Create new institution
        const institution = new Institution({
            name,
            university,
            courses: courses ? courses.filter(course => course && course.trim() !== '') : []
        });

        const savedInstitution = await institution.save();

        // Populate university details in the response
        const populatedInstitution = await savedInstitution.populate('university', 'name');

        res.status(201).json(populatedInstitution);
    } catch (error) {
        console.error('Error creating institution:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all institutions with university details
router.get('/', authRequired, async (req, res) => {
    try {
        const institutions = await Institution.find()
            .populate('university', 'name')
            .sort({ createdAt: -1 });
        res.json(institutions);
    } catch (error) {
        console.error('Error fetching institutions:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;