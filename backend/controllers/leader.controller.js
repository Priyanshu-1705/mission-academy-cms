import Leader from "../models/Leader.model.js";
import { isValidObjectId } from "../utils/isValidObjectId.util.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.util.js";

/**
 * Leader Controller
 *
 * Purpose:
 * Handles all CRUD operations and reordering logic for leadership
 * council members shown on the About page.
 *
 * Responsibilities:
 * - Create a new leader.
 * - Fetch all leaders (admin and public use the same data; only the
 *   auth requirement differs between the two routes).
 * - Update an existing leader's details.
 * - Delete a leader.
 * - Reorder leaders (swap two leaders' order values).
 *
 * Notes:
 * Only Super Admin can manage leaders — see leader.route.js, where
 * every admin route is protected by requireRole("super_admin").
 * getPublicLeaders has no auth requirement, since visitors browsing
 * the About page need to see leadership messages regardless of role.
 */

/**
 * GET /api/leaders
 *
 * Admin-facing: returns all leaders, sorted by display order.
 * Protected route — Super Admin only.
 */
export const getLeaders = async (req, res) => {
    try {
        const leaders = await Leader.find().sort({ order: 1, createdAt: 1 });
        return res.status(200).json({
            success: true,
            message: "Leaders retrieved successfully.",
            data: leaders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * GET /api/public/leaders
 *
 * Public-facing: returns all leaders, sorted by display order.
 * No auth required — used by the About page.
 */
export const getPublicLeaders = async (req, res) => {
    try {
        const leaders = await Leader.find().sort({ order: 1, createdAt: 1 });
        return res.status(200).json({
            success: true,
            message: "Leaders retrieved successfully.",
            data: leaders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * POST /api/leaders
 * Now expects a real image file (multipart/form-data) instead of a
 * JSON photoUrl string.
 */
export const createLeader = async (req, res) => {
    try {
        const { name, designation, message } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Leader photo is required."
            });
        }

        const errors = {};

        if (!name?.trim()) errors.name = "Name is required.";
        if (!designation?.trim()) errors.designation = "Designation is required.";
        if (!message?.trim()) errors.message = "Message is required.";

        if (Object.keys(errors).length) {
            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors
            });
        }

        const { url, publicId } = await uploadToCloudinary(req.file.buffer, "leaders", "image");

        const lastLeader = await Leader.findOne().sort({ order: -1 });
        const nextOrder = lastLeader ? lastLeader.order + 1 : 0;

        const leader = await Leader.create({
            name: name.trim(),
            designation: designation.trim(),
            message: message.trim(),
            photoUrl: url,
            cloudinaryPublicId: publicId,
            order: nextOrder
        });

        return res.status(201).json({
            success: true,
            message: "Leader created successfully.",
            data: leader
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * PATCH /api/leaders/:id
 *
 * Updates an existing leader's details. Order is intentionally NOT
 * editable here — reordering has its own dedicated endpoint, since
 * it affects two leaders at once.
 * A new photo is optional — if provided, the old Cloudinary image is
 * replaced; if not, only the text fields change.
 */
export const updateLeader = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid leader id."
            });
        }

        const { name, designation, message } = req.body;
        const leader = await Leader.findById(id);

        if (!leader) {
            return res.status(404).json({
                success: false,
                message: "Leader not found."
            });
        }

        if (req.file) {
            const { url, publicId } = await uploadToCloudinary(req.file.buffer, "leaders", "image");
            // The new image is already live in Cloudinary at this point.
            // Deleting the OLD one is best-effort cleanup — if it fails,
            // the update itself has still genuinely succeeded, so this
            // must not throw and turn a successful update into a 500.
            try {
                await deleteFromCloudinary(leader.cloudinaryPublicId, "image");
            } catch (cloudinaryError) {
                console.error("[Leader Controller] Failed to delete previous leader image:", {
                    leaderId: leader._id,
                    publicId: leader.cloudinaryPublicId,
                    error: cloudinaryError.message
                });
            }
            leader.photoUrl = url;
            leader.cloudinaryPublicId = publicId;
        }

        if (name !== undefined) leader.name = name.trim();
        if (designation !== undefined) leader.designation = designation.trim();
        if (message !== undefined) leader.message = message.trim();

        await leader.save();

        return res.status(200).json({
            success: true,
            message: "Leader updated successfully.",
            data: leader
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * DELETE /api/leaders/:id
 *
 * Deletes a leader permanently. Does not renumber the remaining
 * leaders' order values — gaps in the sequence are harmless since
 * sorting only cares about relative order, not consecutive numbering.
 */
export const deleteLeader = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid leader id." });
        }

        const leader = await Leader.findByIdAndDelete(id);

        if (!leader) {
            return res.status(404).json({ success: false, message: "Leader not found." });
        }

        try {
            await deleteFromCloudinary(leader.cloudinaryPublicId, "image");
        } catch (cloudinaryError) {
            console.error(
                "[Leader Controller] Cloudinary cleanup failed for deleted leader:",
                leader._id.toString(),
                cloudinaryError.message
            );
        }

        return res.status(200).json({ success: true, message: "Leader deleted successfully." });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * PATCH /api/leaders/:id/reorder
 *
 * Moves a leader up or down by swapping its order value with the
 * adjacent leader in that direction. Expects { direction: "up" | "down" }.
 */
export const reorderLeader = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid leader id."
            });
        }

        const { direction } = req.body;

        if (direction !== "up" && direction !== "down") {
            return res.status(400).json({
                success: false,
                message: "direction must be 'up' or 'down'."
            });
        }

        const currentLeader = await Leader.findById(id);

        if (!currentLeader) {
            return res.status(404).json({
                success: false,
                message: "Leader not found."
            });
        }

        // "up" means an earlier position, so we look for the leader
        // with the next-lowest order value. "down" looks for the next-highest.
        const adjacentLeader =
            direction === "up"
                ? await Leader.findOne({ order: { $lt: currentLeader.order } }).sort({ order: -1 })
                : await Leader.findOne({ order: { $gt: currentLeader.order } }).sort({ order: 1 });

        if (!adjacentLeader) {
            // Already at the top or bottom — nothing to swap with.
            return res.status(200).json({
                success: true,
                message: "Leader is already at the edge of the order.",
                data: await Leader.find().sort({ order: 1 })
            });
        }

        const tempOrder = currentLeader.order;
        currentLeader.order = adjacentLeader.order;
        adjacentLeader.order = tempOrder;

        await currentLeader.save();
        await adjacentLeader.save();

        const updatedLeaders = await Leader.find().sort({ order: 1 });

        return res.status(200).json({
            success: true,
            message: "Leader reordered successfully.",
            data: updatedLeaders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};