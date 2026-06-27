import express from "express";
import protect from "../middleware/auth.middleware.js";
import requireRole from "../middleware/requireRole.middleware.js";
import {
    getLeaders,
    createLeader,
    updateLeader,
    deleteLeader,
    reorderLeader
} from "../controllers/leader.controller.js";

/**
 * Leader Routes
 *
 * Purpose:
 * Defines all HTTP endpoints for managing leadership council members.
 *
 * Responsibilities:
 * - Mount every route behind protect + requireRole("super_admin"),
 *   since Leadership Management is restricted to Super Admin only.
 *
 * Notes:
 * The public, no-auth route for fetching leaders lives in
 * public.route.js instead, not here — mixing protected and
 * unprotected routes in the same file risks someone adding a new
 * route later without noticing it skips protect.
 */

const router = express.Router();

router.get("/", protect, requireRole("super_admin"), getLeaders);
router.post("/", protect, requireRole("super_admin"), createLeader);
router.patch("/:id", protect, requireRole("super_admin"), updateLeader);
router.delete("/:id", protect, requireRole("super_admin"), deleteLeader);
router.patch("/:id/reorder", protect, requireRole("super_admin"), reorderLeader);

export default router;