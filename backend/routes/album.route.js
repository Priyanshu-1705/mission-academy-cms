import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
    getAlbums,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    addImageToAlbum,
    deleteImageFromAlbum
} from "../controllers/album.controller.js";

/**
 * Album Routes
 *
 * Purpose:
 * Defines all HTTP endpoints for managing photo albums.
 *
 * Responsibilities:
 * - Mount every admin route behind protect (login required).
 *
 * Notes:
 * Both Super Admin and Principal can manage albums — no requireRole
 * restriction is applied here.
 */

const router = express.Router();

router.get("/", protect, getAlbums);
router.post("/", protect, createAlbum);
router.patch("/:id", protect, updateAlbum);
router.delete("/:id", protect, deleteAlbum);
router.post("/:id/images", protect, addImageToAlbum);
router.delete("/:id/images/:imageId", protect, deleteImageFromAlbum);

export default router;
