import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
    getBanners,
    getPublicBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    reorderBanner
} from "../controllers/banner.controller.js";

/**
 * Banner Routes
 *
 * Purpose:
 * Defines all HTTP endpoints for managing homepage hero banners.
 *
 * Responsibilities:
 * - Mount admin routes behind the protect middleware (login required).
 * - Mount the public route with no auth (used by the homepage).
 *
 * Notes:
 * Both Super Admin and Principal can manage banners — no requireRole
 * restriction is applied here, unlike Mandatory Disclosure or Users.
 * This file only defines the /banners-relative paths; the /api and
 * /api/public prefixes are added when this router is mounted in
 * server.js.
 */

const router = express.Router();

// Admin routes — require a valid logged-in session.

// Retrieve all banners (Admin CMS)
router.get("/", protect, getBanners);

// Create a new banner
router.post("/", protect, createBanner);

// Update banner details
router.patch("/:id", protect, updateBanner);

// Delete a banner
router.delete("/:id", protect, deleteBanner);

// Change banner display order
router.patch("/:id/reorder", protect, reorderBanner);

export default router;