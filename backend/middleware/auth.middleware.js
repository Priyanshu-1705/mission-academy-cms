import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

/**
 * Authentication Middleware
 *
 * Purpose:
 * Verifies JWT access tokens for protected routes.
 *
 * Responsibilities:
 * - Extract JWT from Authorization header.
 * - Verify token signature.
 * - Check whether the user still exists.
 * - Block disabled accounts.
 * - Attach authenticated user to req.user.
 *
 * Notes:
 * Does not perform role-based authorization.
 * Role checks are handled by requireRole middleware.
 */

const protect = async (req, res, next) => {
    let token;

    // Extract the JWT from the Authorization header.
    // Expected format:
    // Authorization: Bearer <JWT_TOKEN>
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ "success":false, message: "Not authorized, no token provided" });
    }

    try {
        // Verify the token's signature and expiry using the same secret
        // that was used to create it at login.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Always fetch the latest user record.
        // This prevents disabled or deleted accounts
        // from accessing protected routes using an old JWT.
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ "success":false, message: "Not authorized, user no longer exists" });
        }

        if (!user.isActive) {
            return res.status(403).json({ "success":false, message: "This account has been disabled" });
        }

        // Store the authenticated user on the request object.
        // Any middleware or controller executed after this
        // can access req.user without another database query.
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ "success":false, message: "Not authorized, invalid or expired token" });
    }
};

export default protect;