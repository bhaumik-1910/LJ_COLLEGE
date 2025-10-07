// import mongoose from "mongoose";

// const studentSchema = new mongoose.Schema(
//   {
//     enrolno: { type: String, required: true, unique: true, trim: true },
//     fullName: { type: String, required: true, trim: true },
//     email: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//       match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     },
//     course: { type: String, required: true, trim: true },
//     contact: { type: String, required: true, trim: true, match: /^\d{10}$/ },
//     gender: { type: String, required: true, enum: ["male", "female", "other"] },
//     address: { type: String, required: true, trim: true }
//   },
//   { timestamps: true }
// );

// export const Student = mongoose.model("Student", studentSchema);

import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  enrolno: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"]
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  // Optional: Reference the faculty member who added the student
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming your user model is named 'User'
  },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

export default Student;