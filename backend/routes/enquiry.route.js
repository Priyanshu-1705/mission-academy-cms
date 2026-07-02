import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
    getEnquiries,
    updateEnquiryStatus,
    deleteEnquiry
} from "../controllers/enquiry.controller.js";

/**
 * Enquiry Routes
 *
 * Purpose:
 * Defines all HTTP endpoints for managing contact form enquiries.
 *
 * Responsibilities:
 * - Mount admin routes behind protect (login required).
 *
 * Notes:
 * This file only defines the /enquiries-relative paths; the /api and
 * /api/public prefixes are added when this router is mounted in
 * server.js.
 */

const router = express.Router();

// Admin routes — require a valid logged-in session and appropriate role.
router.get("/", protect, getEnquiries);
router.patch("/:id/status", protect, updateEnquiryStatus);
router.delete("/:id", protect, deleteEnquiry);

export default router;
