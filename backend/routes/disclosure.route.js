import express from "express";
import protect from "../middleware/auth.middleware.js";
import requireRole from "../middleware/requireRole.middleware.js";
import {
    getDisclosures,
    createDisclosure,
    updateDisclosure,
    deleteDisclosure
} from "../controllers/disclosure.controller.js";

/**
 * Disclosure Routes
 *
 * Purpose:
 * Defines all HTTP endpoints for managing mandatory public disclosures.
 *
 * Responsibilities:
 * - Protect all admin routes with authentication.
 * - Restrict create, update, and delete operations to Super Admin.
 * - Allow authenticated admins to view disclosures.
 * 
 * Notes:
 * The public, no-auth route for fetching disclosures lives in
 * public.route.js instead, not here — mixing protected and
 * unprotected routes in the same file risks someone adding a new
 * route later without noticing it skips protect.
 */

const router = express.Router();

router.get("/", protect, requireRole("super_admin"), getDisclosures);
router.post("/", protect, requireRole("super_admin"), createDisclosure);
router.patch("/:id", protect, requireRole("super_admin"), updateDisclosure);
router.delete("/:id", protect, requireRole("super_admin"), deleteDisclosure);

export default router;
