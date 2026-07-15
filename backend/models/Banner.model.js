import mongoose from "mongoose";

/**
 * Banner Model
 *
 * Purpose:
 * Represents a single banner displayed in the homepage hero slider.
 *
 * Responsibilities:
 * - Store the banner image URL.
 * - Store optional per-slide marketing text and call-to-action.
 * - Control banner visibility.
 * - Maintain display order.
 *
 * Notes:
 * Banner images are stored in Cloudinary.
 * Both Super Admin and Principal can manage banners.
 * title/subtitle/ctaText/ctaLink are all optional — a banner can be
 * a purely decorative image with no text overlay, or a fully
 * captioned slide with its own call-to-action button.
 */

const bannerSchema = new mongoose.Schema({
        imageUrl: {
            type: String,
            required: true
        },
        cloudinaryPublicId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            trim: true,
            maxlength: 150
        },
        subtitle: {
            type: String,
            trim: true,
            maxlength: 300
        },
        ctaText: {
            type: String,
            trim: true,
            maxlength: 40
        },
        ctaLink: {
            type: String,
            trim: true
        },
        active: {
            type: Boolean,
            default: true
        },
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

bannerSchema.index({ order: 1 });

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;