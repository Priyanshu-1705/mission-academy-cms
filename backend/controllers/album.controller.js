import Album from "../models/Album.model.js";
import { isValidObjectId } from "../utils/isValidObjectId.util.js";

/**
 * Album Controller
 *
 * Purpose:
 * Handles all CRUD operations for photo albums, plus adding and
 * removing individual photos within an album.
 *
 * Responsibilities:
 * - Create a new album (can start with zero photos).
 * - Fetch albums (admin: all; public: same data, no auth).
 * - Update an album's metadata (name, description, cover, date).
 * - Delete an album entirely.
 * - Add a photo to an album.
 * - Delete a specific photo from an album.
 *
 * Notes:
 * Both Super Admin and Principal can manage galleries.
 * Album.find() always returns an array (possibly empty), never null
 * — so there is no "album list not found" case to handle, unlike
 * findById, which does return null when nothing matches.
 */

/**
 * Shared internal helper — used by both getAlbums and getPublicAlbums
 * so the actual query logic exists in exactly one place.
 */
const fetchAlbums = async () => {
    return Album.find().sort({ date: -1 });
};

/**
 * GET /api/albums
 * Admin-facing. Protected route.
 */
export const getAlbums = async (req, res) => {
    try {
        const albums = await fetchAlbums();
        return res.status(200).json({
            success: true,
            message: "Albums retrieved successfully.",
            data: albums
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

/**
 * GET /api/public/albums
 * Public-facing. No auth required.
 */
export const getPublicAlbums = async (req, res) => {
    try {
        const albums = await fetchAlbums();
        return res.status(200).json({
            success: true,
            message: "Albums retrieved successfully.",
            data: albums
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

/**
 * POST /api/albums
 *
 * Creates a new album. images is intentionally NOT accepted here —
 * albums are created empty and photos are added afterward through
 * addImageToAlbum, matching the frontend's "Create Album" → "Manage
 * Photos" two-step workflow.
 */
export const createAlbum = async (req, res) => {
    try {
        const { name, description, coverImageUrl, date } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name and date are required."
            });
        }

        // In createAlbum, after checking name/date exist:
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid album date."
            });
        }

        const album = await Album.create({
            name,
            description,
            coverImageUrl,
            date: parsedDate
        });

        return res.status(201).json({
            success: true,
            message: "Album created successfully.",
            data: album
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

/**
 * PATCH /api/albums/:id
 *
 * Updates album metadata only — not images. Adding/removing photos
 * has its own dedicated endpoints below.
 */
export const updateAlbum = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid album id." });
        }

        const { name, description, coverImageUrl, date } = req.body;
        const album = await Album.findById(id);

        if (!album) {
            return res.status(404).json({ success: false, message: "Album not found." });
        }

        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({ success: false, message: "Name cannot be empty." });
            }
            album.name = name;
        }

        

        if (description !== undefined) album.description = description;
        if (coverImageUrl !== undefined) album.coverImageUrl = coverImageUrl;
        // In updateAlbum, replacing the plain "if (date !== undefined) album.date = date;" line:
        if (date !== undefined) {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid album date."
                });
            }
            album.date = date;
        }

        await album.save();

        return res.status(200).json({
            success: true,
            message: "Album updated successfully.",
            data: album
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

/**
 * DELETE /api/albums/:id
 *
 * Deletes the album and all of its embedded photos at once, since
 * the photos live inside the album document itself.
 */
export const deleteAlbum = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid album id." });
        }

        const album = await Album.findByIdAndDelete(id);

        if (!album) {
            return res.status(404).json({ success: false, message: "Album not found." });
        }

        return res.status(200).json({ success: true, message: "Album deleted successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

/**
 * POST /api/albums/:id/images
 *
 * Adds a single photo to an existing album's embedded images array.
 */
export const addImageToAlbum = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid album id." });
        }

        const { url, caption } = req.body;

        if (!url?.trim()) {
            return res.status(400).json({ success: false, message: "Image URL is required." });
        }

        const album = await Album.findById(id);

        if (!album) {
            return res.status(404).json({ success: false, message: "Album not found." });
        }

        album.images.push({ url, caption });
        await album.save();

        return res.status(200).json({
            success: true,
            message: "Image added to album successfully.",
            data: album
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

/**
 * DELETE /api/albums/:id/images/:imageId
 *
 * Removes a single photo from an album's embedded images array,
 * identified by the image's own auto-generated _id.
 */
export const deleteImageFromAlbum = async (req, res) => {
    try {
        const { id, imageId } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid album id." });
        }

        if (!isValidObjectId(imageId)) {
            return res.status(400).json({ success: false, message: "Invalid image id." });
        }

        const album = await Album.findById(id);

        if (!album) {
            return res.status(404).json({ success: false, message: "Album not found." });
        }

        const initialImageCount = album.images.length;
        album.images = album.images.filter((image) => image._id.toString() !== imageId);

        if (album.images.length === initialImageCount) {
            return res.status(404).json({ success: false, message: "Image not found in album." });
        }

        await album.save();

        return res.status(200).json({
            success: true,
            message: "Image deleted from album successfully.",
            data: album
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};