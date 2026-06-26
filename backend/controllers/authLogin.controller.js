import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

/**
 * Authentication Controller
 *
 * Purpose:
 * Handles administrator authentication for the CMS.
 *
 * Responsibilities:
 * - Validate login credentials.
 * - Verify administrator account.
 * - Compare hashed password.
 * - Generate JWT access token.
 * - Return authenticated user information.
 *
 * Notes:
 * - Only Super Admin and Principal can log in.
 * - There is no public registration endpoint.
 * - Accounts are created by the seed script or by Super Admin.
 */

/**
 * POST /api/auth/login
 *
 * Authenticates a CMS administrator.
 */
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic request validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // Normalize email to avoid issues caused by uppercase letters
        // or accidental leading/trailing spaces.
        const normalizedEmail = email.trim().toLowerCase();

        // Password is hidden by default (select: false),
        // so it must be explicitly selected during login.
        const user = await User.findOne({
            email: normalizedEmail
        }).select("+password");

        // Use a generic error message to prevent attackers from
        // discovering whether an email address exists.
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Prevent disabled administrators from logging in,
        // even if they still know their password.
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "This account has been disabled."
            });
        }

        // Compare the entered password with the hashed password
        // stored in the database.
        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Generate a JWT containing only the user's ID.
        // User details and permissions are always fetched
        // from the database on protected requests.
        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "7d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};