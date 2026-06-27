import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
} from "../controllers/event.controller.js";

/**
 * Event Routes
 *
 * Purpose:
 * Defines all HTTP endpoints for managing the school events calendar.
 *
 * Responsibilities:
 * - Mount every admin route behind protect (login required).
 *
 * Notes:
 * Both Super Admin and Principal can manage events — no requireRole
 * restriction is applied here.
 */

const router = express.Router();

router.get("/", protect, getEvents);
router.post("/", protect, createEvent);
router.patch("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

export default router;