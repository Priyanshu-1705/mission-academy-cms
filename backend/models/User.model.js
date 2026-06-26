import mongoose from "mongoose";

// User Model
// This application has only two user roles:
// 1. super_admin -> Developer/Website Administrator
// 2. principal -> School Administrator
//
// Authentication is handled using JWT.
// Passwords are stored as hashed values (never plain text).

const userSchema = new mongoose.Schema(
    {
        // Full name of the administrator
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        // Email is used as the unique login identifier.
        // It is converted to lowercase to avoid duplicate accounts
        // caused by different letter casing.
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
        },

        // Stores the hashed password.
        // Password is excluded from query results by default
        // and is only selected explicitly during login.
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false
        },

        // Controls what the user is allowed to access
        // throughout the CMS.
        role: {
            type: String,
            enum: ["super_admin", "principal"],
            required: true
        },

        // Allows disabling an account without deleting it.
        // Disabled users cannot log in.
        isActive: {
            type: Boolean,
            default: true
        }
    },

    // Automatically creates:
    // createdAt
    // updatedAt
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;