import mongoose from "mongoose";

/**
 * Board Achiever Model
 *
 * Purpose:
 * Represents a student who achieved high marks in board exams.
 *
 * Responsibilities:
 * - Store student details (name, class, percentage, rank, year).
 * - Store the student's photograph.
 * - The actual file is stored on Cloudinary.
 * - Cloudinary public ID used when replacing or deleting
 * - the image so the storage stays clean.
 *
 * Notes:
 * Board achievers are always public.
 * Only the Super Admin can create, update, or delete achievers.
 */
const boardAchieverSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    className: {
        type: String,
        required: true,
        enum: ["Class X", "Class XII"]
    },
    stream: {
        type: String,
        enum: ["Science", "Commerce", "Arts"]
    },
    percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    rank: {
        type: Number,
        required: true,
        min: 1
    },
    year: {
        type: String,
        required: true,
        trim: true,
        match: /^\d{4}-\d{2}$/
        // (e.g. "2025-26")
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true
    },
    cloudinaryPublicId: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

boardAchieverSchema.index({ year: 1, rank: 1 });

const BoardAchiever = mongoose.model("BoardAchiever", boardAchieverSchema);

export default BoardAchiever;