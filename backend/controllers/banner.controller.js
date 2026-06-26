import Banner from "../models/Banner.model.js";
import { isValidObjectId } from "../utils/isValidObjectId.util.js";

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
 * Deleting a banner currently removes only the MongoDB record.
 * Cloudinary image cleanup (deleting the actual file from storage)
 * will be added once Cloudinary upload integration is implemented —
 * until then, deleted banners' images remain in Cloudinary storage.
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
 *
 * Creates a new banner, appended at the end of the current order.
 */
export const createBanner = async (req, res) => {
    try {
        const { imageUrl, active } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: "imageUrl is required."
            });
        }

        const lastBanner = await Banner.findOne().sort({ order: -1 });
        const nextOrder = lastBanner ? lastBanner.order + 1 : 0;

        const banner = await Banner.create({
            imageUrl,
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
 *
 * Updates an existing banner's image and/or active status.
 * Order is intentionally NOT editable here — see reorderBanner.
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

        const { imageUrl, active } = req.body;

        const banner = await Banner.findById(id);

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found."
            });
        }

        if (imageUrl !== undefined) banner.imageUrl = imageUrl;
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
 *
 * Deletes a banner permanently. Only removes the MongoDB record —
 * see file header note regarding deferred Cloudinary cleanup.
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