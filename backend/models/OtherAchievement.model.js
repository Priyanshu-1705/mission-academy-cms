import mongoose from "mongoose";

/**
 * Other Achievement Model
 *
 * Purpose:
 * Represents a school achievement other than board examination results.
 *
 * Responsibilities:
 * - Store achievement details (title, description, category, date).
 * - Store an associated image.
 * - Allow marking an achievement to be shown on the homepage.
 *
 * Notes:
 * Other achievements are always public.
 * Only the Super Admin can create, update, or delete achievements.
 */

const otherAchievementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    category: {
        type: String,
        enum: ["Sports", "Science", "Cultural", "Other"],
        default: "Other"
    },
    date: {
        type: Date,
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
    },
    showOnHomepage: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

otherAchievementSchema.index({ showOnHomepage: 1 });

const OtherAchiever = mongoose.model("OtherAchiever", otherAchievementSchema);

export default OtherAchiever;