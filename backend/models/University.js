import mongoose from "mongoose";

const universitySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    },
    { timestamps: true }
);

export default mongoose.model("University", universitySchema);
