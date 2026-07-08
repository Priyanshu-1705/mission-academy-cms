/**
 * Authorization Middleware
 *
 * Purpose:
 * Restricts access to routes based on the authenticated user's role.
 *
 * Responsibilities:
 * - Verify that req.user exists.
 * - Check whether the user's role is allowed.
 * - Return 403 for unauthorized roles.
 *
 * Notes:
 * This middleware MUST be used after the `protect` middleware.
 * It assumes authentication has already been completed.
 */

const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            // Defensive check.
            // Prevents runtime errors if this middleware is accidentally
            // used before the authentication middleware.
            return res.status(401).json({ "success":false, message: "Not authorized, no user found on request" });
        }
        // Allow access only if the authenticated user's role
        // exists in the list of permitted roles.
        // Current application roles:
        // super_admin -> Developer / Website Administrator
        // principal   -> School Administrator
        // Future roles can be added without changing this middleware.
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                "success":false,
                message: "You do not have permission to perform this action"
            });
        }

        next();
    };
};

export default requireRole;