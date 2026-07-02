import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
    getRegistrations,
    updateRegistrationStatus,
    updateRegistration,
    deleteRegistration
} from "../controllers/registration.controller.js";

/**
 * Registration Routes
 *
 * Purpose:
 * Defines all HTTP endpoints for student admission registrations.
 *
 * Responsibilities:
 * - Mount admin routes behind protect + requireRole("super_admin", "principal").
 *
 * Notes:
 * Only Super Admin and Principal can view and update registrations.
 * There is no public-facing GET route for registrations.
 */

const router = express.Router();

// Admin routes - require a valid logged-in session
router.get("/", protect, getRegistrations);
router.patch("/:id/status", protect, updateRegistrationStatus);
router.patch("/:id", protect, updateRegistration);
router.delete("/:id", protect, deleteRegistration);

export default router;
