import Album from "../models/Album.model.js";
import { isValidObjectId } from "../utils/isValidObjectId.util.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.util.js";

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
 * Cover image is optional at creation — matches the frontend's
 * "create empty, add photos later" workflow. If provided, it's
 * uploaded the same way as any other image field.
 */
export const createAlbum = async (req, res) => {
    try {
        const { name, description, date } = req.body;

        if (!name?.trim() || !date) {
            return res.status(400).json({ success: false, message: "Name and date are required." });
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ success: false, message: "Invalid album date." });
        }

        let coverImageUrl;
        let coverImagePublicId;

        if (req.file) {
            const { url, publicId } = await uploadToCloudinary(req.file.buffer, "albums/covers", "image");
            coverImageUrl = url;
            coverImagePublicId = publicId;
        }

        const album = await Album.create({
            name,
            description,
            date,
            coverImageUrl,
            coverImagePublicId
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
 * Cover image replacement is optional, same pattern as Banner/Leader.
 */
export const updateAlbum = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid album id." });
        }

        const { name, description, date } = req.body;
        const album = await Album.findById(id);

        if (!album) {
            return res.status(404).json({ success: false, message: "Album not found." });
        }

        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({ success: false, message: "Name cannot be empty." });
            }
            album.name = name.trim();
        }

        if (description !== undefined) album.description = description.trim();

        if (date !== undefined) {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({ success: false, message: "Invalid album date." });
            }
            album.date = date;
        }

        if (req.file) {
            const { url, publicId } = await uploadToCloudinary(req.file.buffer, "albums/covers", "image");

            if (album.coverImagePublicId) {
                try {
                    await deleteFromCloudinary(album.coverImagePublicId, "image");
                } catch (cloudinaryError) {
                    console.error("[Album Controller] Failed to delete previous cover image:", {
                        albumId: album._id,
                        publicId: album.coverImagePublicId,
                        error: cloudinaryError.message
                    });
                }
            }

            album.coverImageUrl = url;
            album.coverImagePublicId = publicId;
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
 * Deletes the album's cover image AND every embedded photo from
 * Cloudinary, since the whole album (and all its photos) is being
 * removed at once. Each deletion is independently best-effort — one
 * failing must not stop the others from being attempted, and none
 * of them should turn an already-successful database deletion into
 * a misleading 500.
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

        if (album.coverImagePublicId) {
            try {
                await deleteFromCloudinary(album.coverImagePublicId, "image");
            } catch (cloudinaryError) {
                console.error("[Album Controller] Failed to delete cover image on album delete:", {
                    albumId: album._id,
                    publicId: album.coverImagePublicId,
                    error: cloudinaryError.message
                });
            }
        }

        for (const image of album.images) {
            try {
                await deleteFromCloudinary(image.publicId, "image");
            } catch (cloudinaryError) {
                console.error("[Album Controller] Failed to delete album photo on album delete:", {
                    albumId: album._id,
                    imageId: image._id,
                    publicId: image.publicId,
                    error: cloudinaryError.message
                });
            }
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
 * Photo file is required — this endpoint's entire purpose is adding
 * a real photo to the album.
 */
export const addImageToAlbum = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid album id." });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image file is required." });
        }

        const { caption } = req.body;

        const album = await Album.findById(id);

        if (!album) {
            return res.status(404).json({ success: false, message: "Album not found." });
        }

        const { url, publicId } = await uploadToCloudinary(req.file.buffer, `albums/${id}`, "image");

        album.images.push({ url, publicId, caption: caption?.trim() || "" });
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

        const imageToDelete = album.images.find((image) => image._id.toString() === imageId);

        if (!imageToDelete) {
            return res.status(404).json({ success: false, message: "Image not found in album." });
        }

        album.images = album.images.filter((image) => image._id.toString() !== imageId);
        await album.save();

        try {
            await deleteFromCloudinary(imageToDelete.publicId, "image");
        } catch (cloudinaryError) {
            console.error("[Album Controller] Failed to delete photo from Cloudinary:", {
                albumId: album._id,
                imageId,
                publicId: imageToDelete.publicId,
                error: cloudinaryError.message
            });
        }

        return res.status(200).json({
            success: true,
            message: "Image deleted from album successfully.",
            data: album
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};