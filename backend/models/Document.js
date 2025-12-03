import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {
        // student: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Student",
        //     required: true,
        // },
        // studentEnrolno: {
        //     type: String,
        //     required: true,
        //     trim: true,
        // },
        // studentName: {
        //     type: String,
        //     required: true,
        //     trim: true,
        // },
        university: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "University",
            required: true,
        },

        universityName: {
            type: String,
            required: true,
            trim: true,
        },

        institute: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institution",
            required: true,
            // type: String,
            // required: true,
            // trim: true,
        },

        instituteName: {
            type: String,
            required: true,
            trim: true,
        },

        course: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        categoryName: {
            type: String,
            required: true,
            trim: true,
        },
        subCategory: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: Date,
            required: true,
        },
        fileUrl: {
            type: String,
            required: true,
        },
        fileOriginalName: String,
        images: {
            type: [String],
            default: [],
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);
export default Document;
