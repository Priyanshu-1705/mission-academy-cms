import mongoose from "mongoose";

/**
 * Achievement Model
 *
 * Purpose:
 * Represents either:
 * - A Board Achiever (Top-performing student)
 * - Any other school achievement (sports, competitions, cultural events, etc.)
 *
 * Notes:
 * Board Achievers and Other Achievements share one collection,
 * distinguished by the `type` field.
 */
const achievementSchema = new mongoose.Schema(
    {
        achievementType: {
            type: String,
            required: true,
            enum: ["board_achiever", "other"]
        },
        title: {
            type: String,
            trim: true,
            maxlength: 100
        },
        description: {
            type: String,
            trim: true,
            maxlength: 1000
        },
        studentName: {
            type: String,
            trim: true
        },
        percentage: {
            type: Number,
            min: 0,
            max: 100
        },
        rank: {
            type: Number,
            min: 1
        },
        className: {
            type: String,
            enum: ["10", "12"]
        },
        academicYear: {
            type: String,
            trim: true
            // Example: "2025-26"
        },
        // Public URL of the achievement image stored on Cloudinary.
        imageUrl: {
            type: String,
            required: true,
            trim: true
        },
        cloudinaryPublicId: {
            type: String,
            required: true,
            trim: true
        },
    },
    {
        timestamps: true
    }
);

achievementSchema.index({
    achievementType: 1,
    academicYear: 1
});

achievementSchema.index({
    studentName: 1
});

achievementSchema.index({
    title: 1
});
const Achievement = mongoose.model("Achievement", achievementSchema);

export default Achievement;
