import mongoose from "mongoose";

/**
 * Settings Model
 *
 * Purpose:
 * Stores global website settings such as contact information and social media links.
 * There should only ever be ONE document in this collection.
 *
 * Responsibilities:
 * - Provide contact phone number.
 * - Provide contact email.
 * - Provide social media links (Instagram, Facebook, YouTube).
 * - Control visibility of the CTA banner.
 *
 * Notes:
 * Only the Super Admin can update these settings.
 */
const settingSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    
    instagramUrl: {
        type: String,
        trim: true
    },

    facebookUrl: {
        type: String,
        trim: true
    },

    youtubeUrl: {
        type: String,
        trim: true
    },

    showCtaBanner: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
});

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;