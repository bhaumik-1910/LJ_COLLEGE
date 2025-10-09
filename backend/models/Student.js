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
  university: {
    type: String,
    required: true,
    trim: true
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