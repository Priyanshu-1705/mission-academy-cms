import mongoose from "mongoose";

/**
 * Banner Model
 *
 * Purpose:
 * Represents a single banner displayed in the homepage hero slider.
 *
 * Responsibilities:
 * - Store the banner image URL.
 * - Control banner visibility.
 * - Maintain display order.
 *
 * Notes:
 * Banner images are stored in Cloudinary.
 * Both Super Admin and Principal can manage banners.
 */

const bannerSchema = new mongoose.Schema(
    {
        // Public URL of the banner image stored in Cloudinary.
        imageUrl: {
            type: String,
            required: true,
            trim: true
        },

        // Determines whether the banner is visible
        // on the public homepage.
        active: {
            type: Boolean,
            default: true
        },

        // Controls display order.
        // Lower numbers appear first.
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

// Optimizes sorting banners by display order.
bannerSchema.index({
    order: 1
});

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;