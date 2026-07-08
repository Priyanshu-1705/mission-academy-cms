import express from "express";
import protect from "../middleware/auth.middleware.js";
import { uploadImage } from "../middleware/upload.middleware.js";
import { handleUploadError } from "../middleware/handleUploadError.middleware.js";
import {
    getOtherAchievements,
    createOtherAchievement,
    updateOtherAchievement,
    deleteOtherAchievement,
    toggleOtherAchievementHomepage
} from "../controllers/otherAchievement.controller.js";

/**
 * Other Achievement Routes
 *
 * Purpose:
 * Defines all HTTP endpoints for managing "other" (non-board) achievements.
 *
 * Responsibilities:
 * - Mount admin routes behind protect.
 * - Mount the public route with no auth.
 *
 * Notes:
 * Only Super Admin can manage other achievements.
 */

const router = express.Router();

// Admin routes — require a valid logged-in session.
router.get("/", protect, getOtherAchievements);
router.post("/", protect,
    uploadImage.single("image"),
    handleUploadError,
    createOtherAchievement
);
router.patch("/:id", protect,
    uploadImage.single("image"),
    handleUploadError,
    updateOtherAchievement
);
router.delete("/:id", protect, deleteOtherAchievement);
router.patch("/:id/toggle-homepage", protect, toggleOtherAchievementHomepage);

export default router;
