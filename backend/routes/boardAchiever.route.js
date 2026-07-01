import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
    getBoardAchievers,
    createBoardAchiever,
    updateBoardAchiever,
    deleteBoardAchiever
} from "../controllers/boardAchiever.controller.js";

/**
 * Board Achiever Routes
 *
 * Purpose:
 * Defines all HTTP endpoints for managing board achievers.
 *
 * Responsibilities:
 * - Mount every route behind protect.
 * - Both Super Admin and Principal can manage board achievers.
 *
 * Notes:
 * The public, no-auth route for fetching board achievers lives in
 * public.route.js instead, not here — mixing protected and
 * unprotected routes in the same file risks someone adding a new
 * route later without noticing it skips protect.
 */

const router = express.Router();

router.get("/", protect, getBoardAchievers);
router.post("/", protect, createBoardAchiever);
router.patch("/:id", protect, updateBoardAchiever);
router.delete("/:id", protect, deleteBoardAchiever);

export default router;
