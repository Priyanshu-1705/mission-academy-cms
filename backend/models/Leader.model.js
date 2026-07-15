import mongoose from "mongoose";

/**
 * Leadership Model
 *
 * Purpose:
 * Represents a leadership profile displayed on
 * the About Us → Leadership page.
 *
 * Responsibilities:
 * - Store leadership information.
 * - Store the leader's profile photograph.
 * - Store the leader's message.
 * - Maintain display order.
 *
 * Notes:
 * Leadership profiles are always public.
 * Only the Super Admin can create, update,
 * reorder or delete leadership profiles.
 */

// Leadership profiles are displayed
// according to their order value.
// Lower numbers appear first.

const leaderSchema = new mongoose.Schema(
    {
        // Full name of the leader (e.g. "Dr. Deepak Kumar").
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },
        // Profile photo, hosted on Cloudinary once upload is wired up.
        photoUrl: {
            type: String,
            required: true
        },
        cloudinaryPublicId: {
            type: String,
            required: true
        },
        // Role/title (e.g. "Principal", "Manager & Founder").
        designation: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        // Short bio
        bio: {
            type: String,
            trim: true,
            maxlength: 1000
        },
        // Welcome/bio message shown alongside the leader's card.
        message: {
            type: String,
            required: true,
            trim: true,
        },
        // Determines display order on the About page. Lower numbers
        // show first. Managed by the reorder endpoint, not edited directly.
        order: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

// Optimizes sorting leaders by display order.
leaderSchema.index({ order: 1 });

const Leader = mongoose.model("Leader", leaderSchema);

export default Leader;