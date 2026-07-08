import express from "express";
import protect from "../middleware/auth.middleware.js";
import { uploadImage } from "../middleware/upload.middleware.js";
import { handleUploadError } from "../middleware/handleUploadError.middleware.js";
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
 *
 * Notes:
 * The public, no-auth route for fetching board achievers lives in
 * public.route.js instead, not here — mixing protected and
 * unprotected routes in the same file risks someone adding a new
 * route later without noticing it skips protect.
 */

const router = express.Router();

router.get("/", protect, getBoardAchievers);
router.post("/", protect,
    uploadImage.single("image"),
    handleUploadError,
    createBoardAchiever
);
router.patch("/:id", protect,
    uploadImage.single("image"),
    handleUploadError,
    updateBoardAchiever
);
router.delete("/:id", protect, deleteBoardAchiever);

export default router;
