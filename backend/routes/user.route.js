import express from "express";
import protect from "../middleware/auth.middleware.js";
import requireRole from "../middleware/requireRole.middleware.js";
import {
    getUsers,
    createPrincipal,
    toggleUserStatus,
    resetUserPassword,
    deleteUser
} from "../controllers/user.controller.js";

/**
 * User Routes
 *
 * Purpose:
 * Defines all HTTP endpoints for managing CMS user accounts.
 *
 * Responsibilities:
 * - Mount every route behind protect + requireRole("super_admin"),
 *   since User Management is restricted to Super Admin only.
 */

const router = express.Router();

router.get("/", protect, requireRole("super_admin"), getUsers);
router.post("/principal", protect, requireRole("super_admin"), createPrincipal);
router.patch("/:id/toggle-status", protect, requireRole("super_admin"), toggleUserStatus);
router.patch("/:id/reset-password", protect, requireRole("super_admin"), resetUserPassword);
router.delete("/:id", protect, requireRole("super_admin"), deleteUser);

export default router;
