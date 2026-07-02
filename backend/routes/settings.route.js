import express from "express";
import protect from "../middleware/auth.middleware.js";
import requireRole from "../middleware/requireRole.middleware.js";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";

/**
 * Settings Routes
 *
 * Purpose:
 * Defines all HTTP endpoints for managing global website settings.
 *
 * Responsibilities:
 * - Mount admin routes behind protect.
 *
 * Notes:
 * Admin can view and update settings.
 */

const router = express.Router();

// Admin routes - require a valid logged-in session.
router.get("/", protect, getSettings);
router.patch("/", protect, updateSettings);

export default router;
