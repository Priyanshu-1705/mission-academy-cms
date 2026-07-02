import mongoose from "mongoose";

/**
 * Enquiry Model
 *
 * Purpose:
 * Represents a contact form submission from the public website.
 *
 * Responsibilities:
 * - Store sender's contact details and message.
 * - Track the status of the enquiry (pending, resolved).
 *
 * Notes:
 * Only the Super Admin and Principal can view and update enquiries.
 */

const enquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^[6-9]\d{9}$/, "Please enter a valid phone number"]
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    message: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ["pending", "resolved"],
        default: "pending"
    }
}, {
    timestamps: true
});

enquirySchema.index({
    status: 1,
    createdAt: -1
});

const Enquiry = mongoose.model("Enquiry", enquirySchema);

export default Enquiry;