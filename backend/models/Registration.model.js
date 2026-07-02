import mongoose from "mongoose";

/**
 * Registration Model
 *
 * Purpose:
 * Represents a student's admission inquiry/registration.
 *
 * Responsibilities:
 * - Store student and parent details.
 * - Track the status of the application (pending, approved, rejected).
 *
 * Notes:
 * Only the Super Admin and Principal can view and update registrations.
 * This is not a user account, but an application for admission.
 */
const registrationSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true
    },
    classApplied: {
        type: String,
        required: true,
        enum: [
            "Nursery",
            "LKG",
            "UKG",
            "Class I",
            "Class II",
            "Class III",
            "Class IV",
            "Class V",
            "Class VI",
            "Class VII",
            "Class VIII",
            "Class IX",
            "Class X",
            "Class XI",
            "Class XII"
        ]
    },
    previousSchool: {
        type: String,
        trim: true
    },
    fatherName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    motherName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    parentPhone: {
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
    address: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, {
    timestamps: true
})

registrationSchema.index({
    status: 1,
    createdAt: -1
});

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;