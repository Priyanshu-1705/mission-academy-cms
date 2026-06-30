import express from "express";
import { getPublicBanners } from "../controllers/banner.controller.js";
import { getPublicLeaders } from "../controllers/leader.controller.js";
import { getPublicEvents } from "../controllers/event.controller.js";
import { getPublicAlbums } from "../controllers/album.controller.js";
import { getPublicAchievements } from "../controllers/achievement.controller.js";

/**
 * Public Routes
 *
 * Purpose:
 * Defines all HTTP endpoints intended for the public-facing website,
 * with no authentication required.
 *
 * Responsibilities:
 * - Aggregate public-facing GET routes across all CMS modules
 *   (banners, gallery, events, etc.) under one /api/public prefix.
 *
 * Notes:
 * As more modules are built (Gallery, Events, Achievements,
 * Mandatory Disclosure), their public-facing GET routes get added
 * here too, keeping all unauthenticated routes visible in one file
 * rather than scattered across each module's route file.
 */

const router = express.Router();

// Retrieve only active banners (Public Homepage)
router.get("/banners", getPublicBanners);

// Retrieve all leaders (Public About Page)
router.get("/leaders", getPublicLeaders);

// Retrieve all events (Public Events Page)
router.get("/events", getPublicEvents);

// Retrieve all albums (Public Gallery Page)
router.get("/albums", getPublicAlbums);

// Retrieve all achievements (Public About Page)
router.get("/achievements", getPublicAchievements);

export default router;