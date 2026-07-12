import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { isValidObjectId } from "../utils/isValidObjectId.util.js";

/**
 * User Controller
 *
 * Purpose:
 * Handles all CRUD operations for CMS user accounts.
 *
 * Responsibilities:
 * - Create a new user.
 * - Fetch all users.
 * - Fetch a single user by ID.
 * - Update an existing user's details (name, email, role, active status).
 * - Reset a user's password.
 * - Delete a user.
 *
 * Notes:
 * Only Super Admin can manage users.
 * Passwords are never returned in API responses.
 */

/**
 * GET /api/users
 *
 * Admin-facing. Protected route.
 *
 * Returns all user accounts.
 */
export const getUsers = async (req, res) => {
    try {
        const users = await User
            .find()
            .select("-password -__v -createdAt -updatedAt")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully.",
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}


const validatePrincipal = (data) => {
    const errors = {};

    if (!data.name?.trim()) {
        errors.name = "Name is required.";
    }

    if (!data.email?.trim()) {
        errors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
        errors.email = "Invalid email.";
    }

    if (!data.password?.trim()) {
        errors.password = "Password is required.";
    } else if (data.password.length < 8) {
        errors.password = "Password must be at least 8 characters.";
    }

    return errors;
};

/**
 * POST /api/users/principal
 *
 * Creates a new principal account.
 * Only accessible by Super Admin.
 */
export const createPrincipal = async (req, res) => {
    try {
        const validationErrors = validatePrincipal(req.body);

        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: validationErrors
            });
        }

        const {
            name,
            email,
            password
        } = req.body;


        // Check existing email
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create principal
        const principal = await User.create({
            name: name.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,

            // Hardcoded
            role: "principal"
        });

        return res.status(201).json({
            success: true,
            message: "Principal account created successfully.",
            data: {
                id: principal._id,
                name: principal.name,
                email: principal.email,
                role: principal.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * PATCH /api/users/:id/toggle-status
 *
 * Update existing principal status.
 * Only accessible by Super Admin.
 */
export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID."
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (user.role === "super_admin") {
            return res.status(403).json({
                success: false,
                message: "Super Admin cannot be disabled."
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        return res.status(200).json({
            success: true,
            message: `User ${user.isActive ? "enabled" : "disabled"} successfully.`,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

/**
 * PATCH /api/users/:id/reset-password
 *
 * Resets a user's password.
 * Only accessible by Super Admin.
 */
export const resetUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        // Validate ID
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID."
            });
        }

        // Validate password
        if (!newPassword?.trim()) {
            return res.status(400).json({
                success: false,
                message: "New password is required."
            });
        }

        if (newPassword.trim().length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters."
            });
        }

        // Find user
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Prevent resetting Super Admin password
        if (user.role !== "principal") {
            return res.status(403).json({
                success: false,
                message: "Only principal accounts can be reset."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

/**
 * DELETE /api/users/:id
 *
 * Deletes a user account.
 * Only accessible by Super Admin.
 */
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID."
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (user.role === "super_admin") {
            return res.status(403).json({
                success: false,
                message: "Super Admin account cannot be deleted."
            });
        }

        await user.deleteOne();

        return res.status(200).json({
            success: true,
            message: "User deleted successfully."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}