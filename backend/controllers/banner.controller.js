import Banner from "../models/Banner.model.js";
import { isValidObjectId } from "../utils/isValidObjectId.util.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.util.js";

/**
 * Banner Controller
 *
 * Purpose:
 * Handles all CRUD operations and reordering logic for homepage
 * hero banners.
 *
 * Responsibilities:
 * - Create a new banner.
 * - Fetch all banners (admin: all; public: active only).
 * - Update an existing banner (image, active status).
 * - Delete a banner.
 * - Reorder banners (swap two banners' order values).
 *
 * Notes:
 * Both Super Admin and Principal can manage banners — no role
 * restriction is applied at the route level for this module.
 */

/**
 * GET /api/banners
 *
 * Admin-facing: returns ALL banners (active and inactive),
 * sorted by display order. Protected route — admin panel only.
 */
export const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ order: 1 });

        return res.status(200).json({
            success: true,
            message: "Banners retrieved successfully.",
            data: banners
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * GET /api/public/banners
 *
 * Public-facing: returns only ACTIVE banners, sorted by display order.
 * Used by the homepage hero carousel. No auth required.
 */
export const getPublicBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ active: true }).sort({ order: 1 });

        return res.status(200).json({
            success: true,
            message: "Banners retrieved successfully.",
            data: banners
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * POST /api/banners
 * Now expects a real image file (multipart/form-data) instead of a
 * JSON imageUrl string. The file is uploaded to Cloudinary first,
 * and its returned URL + publicId are what actually get saved.
 */
export const createBanner = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Banner image is required." });
        }
        const active =
            req.body.active === undefined
                ? true
                : req.body.active === "true";

        const { url, publicId } = await uploadToCloudinary(req.file.buffer, "banners");

        const lastBanner = await Banner.findOne().sort({ order: -1 });
        const nextOrder = lastBanner ? lastBanner.order + 1 : 0;

        const banner = await Banner.create({
            imageUrl: url,
            cloudinaryPublicId: publicId,
            active: active !== undefined ? active : true,
            order: nextOrder
        });

        return res.status(201).json({
            success: true,
            message: "Banner created successfully.",
            data: banner
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * PATCH /api/banners/:id
 * A new file is optional on update — if provided, the old Cloudinary
 * image is deleted and replaced; if not provided, only active/order
 * related fields change and the existing image stays untouched.
 */
export const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid banner id."
            });
        }

        const { active } = req.body;
        const banner = await Banner.findById(id);

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found."
            });
        }

        if (req.file) {
            const { url, publicId } = await uploadToCloudinary(req.file.buffer, "banners", "image");

            // Delete the old image from Cloudinary only after the new one
            // uploads successfully — avoids losing both if the new upload fails.
            await deleteFromCloudinary(banner.cloudinaryPublicId, "image");

            banner.imageUrl = url;
            banner.cloudinaryPublicId = publicId;
        }

        if (active !== undefined) banner.active = active;

        await banner.save();

        return res.status(200).json({
            success: true,
            message: "Banner updated successfully.",
            data: banner
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * DELETE /api/banners/:id
 * Now actually deletes the Cloudinary file too, closing the gap
 * that was previously just a comment.
 */
export const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid banner id."
            });
        }

        const banner = await Banner.findByIdAndDelete(id);

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found."
            });
        }

        // Cloudinary cleanup is best-effort — if it fails, the banner is
        // still genuinely deleted from the database, so the response must
        // still report success. A failed cleanup just leaves an orphaned
        // file in Cloudinary storage, which is a minor, recoverable issue,
        // not a reason to tell the admin their delete failed.
        try {
            await deleteFromCloudinary(banner.cloudinaryPublicId, "image");
        } catch (cloudinaryError) {
            console.error(
                "[Banner Controller] Cloudinary cleanup failed for deleted banner:",
                banner._id.toString(),
                cloudinaryError.message
            );
        }

        return res.status(200).json({
            success: true,
            message: "Banner deleted successfully."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * PATCH /api/banners/:id/reorder
 *
 * Moves a banner up or down by swapping its order value with the
 * adjacent banner in that direction. Expects { direction: "up" | "down" }.
 */
export const reorderBanner = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid banner id."
            });
        }

        const { direction } = req.body;

        if (direction !== "up" && direction !== "down") {
            return res.status(400).json({
                success: false,
                message: "direction must be 'up' or 'down'."
            });
        }

        const currentBanner = await Banner.findById(id);

        if (!currentBanner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found."
            });
        }

        const adjacentBanner =
            direction === "up"
                ? await Banner.findOne({ order: { $lt: currentBanner.order } }).sort({ order: -1 })
                : await Banner.findOne({ order: { $gt: currentBanner.order } }).sort({ order: 1 });

        if (!adjacentBanner) {
            return res.status(200).json({
                success: true,
                message: "Banner is already at the edge of the order.",
                data: await Banner.find().sort({ order: 1 })
            });
        }

        const tempOrder = currentBanner.order;
        currentBanner.order = adjacentBanner.order;
        adjacentBanner.order = tempOrder;

        await currentBanner.save();
        await adjacentBanner.save();

        const updatedBanners = await Banner.find().sort({ order: 1 });

        return res.status(200).json({
            success: true,
            message: "Banner reordered successfully.",
            data: updatedBanners
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};