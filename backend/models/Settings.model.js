import mongoose from "mongoose";

/**
 * Settings Model
 *
 * Purpose:
 * Stores global website settings such as contact information and
 * social media links. There should only ever be ONE document in
 * this collection.
 *
 * Responsibilities:
 * - Provide contact phone number(s).
 * - Provide contact email.
 * - Provide social media links (Instagram, Facebook, YouTube).
 * - Control visibility of the CTA banner.
 *
 * Notes:
 * Only the Super Admin can update these settings — actually, per
 * the auth document, both Super Admin and Principal can edit
 * Phone/Email/Instagram/YouTube; School Name/Address/Logo are not
 * part of this model at all, since those are static and non-editable.
 * Fields allow an empty string as a valid state (not just a valid
 * phone/email format) so a fresh, unconfigured Settings document can
 * exist safely before an admin has entered real values yet.
 */
const settingSchema = new mongoose.Schema(
    {
        phone: {
            type: String,
            trim: true,
            default: "",
            validate: {
                validator(value) {
                    if (!value?.trim()) return true;
                    // Allows one or more comma-separated phone numbers, each with
                    // optional country code, spaces, hyphens, and parentheses —
                    // matches real formats like "+91-9876543210, +91-5822-260011"
                    return /^[+\d][\d\s\-()]{6,20}(,\s*[+\d][\d\s\-()]{6,20})*$/.test(value);
                },
                message: "Please enter a valid phone number or numbers."
            }
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: "",
            validate: {
                validator(value) {
                    return value === "" || /^\S+@\S+\.\S+$/.test(value);
                },
                message: "Please enter a valid email."
            }
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
    },
    {
        timestamps: true
    }
);

const Settings = mongoose.model("Settings", settingSchema);

export default Settings;