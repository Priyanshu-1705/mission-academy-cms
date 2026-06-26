import express from "express";
import { getPublicBanners } from "../controllers/banner.controller.js";

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

export default router;