// // backend/models/Institution.js
// import mongoose from "mongoose";

// const institutionSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     university: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'University',
//         required: true
//     },
//     courses: {
//         type: [String],
//         default: [],
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// // Compound index to ensure unique institution names within a university
// institutionSchema.index({ name: 1, university: 1 }, { unique: true });

// module.exports = mongoose.model('Institution', institutionSchema);

import mongoose from "mongoose";

const institutionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    university: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'University',
        // required: true
        type: String,
        required: true,
    },
    courses: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Add index for faster queries
institutionSchema.index({ university: 1, name: 1 }, { unique: true });

// Add a pre-save hook to ensure course names are unique and non-empty
institutionSchema.pre('save', function (next) {
    if (this.courses && Array.isArray(this.courses)) {
        // Remove empty courses and trim whitespace
        this.courses = this.courses
            .map(course => course.trim())
            .filter(course => course !== '');

        // Remove duplicates
        this.courses = [...new Set(this.courses)];
    }
    next();
});

const Institution = mongoose.model('Institution', institutionSchema);

export default Institution;