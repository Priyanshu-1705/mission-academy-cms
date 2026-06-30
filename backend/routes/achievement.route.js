import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
    getAchievements,
    createAchievement,
    updateAchievement,
    deleteAchievement,
} from "../controllers/achievement.controller.js";

/**
 * Achievement Routes
 *
 * Purpose:
 * Defines all HTTP endpoints for managing achievements.
 *
 * Responsibilities:
 * - Mount admin routes behind the protect middleware.
 *
 * Notes:
 * - Both Super Admin and Principal can manage achievements,
 * so no requireRole middleware is applied.
 * - Public routes are defined separately in public.route.js.
 *
 * The public-facing route lives in public.route.js to keep
 * aut
 */

const router = express.Router();


// Admin routes — require a valid logged-in session.
router.get("/", protect, getAchievements);
router.post("/", protect, createAchievement);
router.patch("/:id", protect, updateAchievement);
router.delete("/:id", protect, deleteAchievement);

export default router;
