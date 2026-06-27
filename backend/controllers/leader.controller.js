import Leader from "../models/Leader.model.js";
import { isValidObjectId } from "../utils/isValidObjectId.util.js";

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
        const leaders = await Leader.find().sort({ order: 1 });
        return res.status(200).json({
            success: true,
            message: "Leaders retrieved successfully.",
            data: leaders
        });
    } catch (error) {
        console.error("[Leader Controller] Get Leaders:", error.message);
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
        const leaders = await Leader.find().sort({ order: 1 });
        return res.status(200).json({
            success: true,
            message: "Leaders retrieved successfully.",
            data: leaders
        });
    } catch (error) {
        console.error("[Leader Controller] Get Public Leaders:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * POST /api/leaders
 *
 * Creates a new leader, appended at the end of the current order.
 */
export const createLeader = async (req, res) => {
    try {
        const { name, photoUrl, designation, message } = req.body;

        if (
            !name?.trim() ||
            !photoUrl?.trim() ||
            !designation?.trim() ||
            !message?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Find the current highest order value so the new leader is
        // appended at the end, not accidentally placed first.
        const lastLeader = await Leader.findOne().sort({ order: -1 });
        const nextOrder = lastLeader ? lastLeader.order + 1 : 0;

        const leader = await Leader.create({
            name,
            photoUrl,
            designation,
            message,
            order: nextOrder
        });

        return res.status(201).json({
            success: true,
            message: "Leader created successfully.",
            data: leader
        });
    } catch (error) {
        console.error("[Leader Controller] Create Leader:", error.message);
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

        const { name, photoUrl, designation, message } = req.body;

        const leader = await Leader.findById(id);

        if (!leader) {
            return res.status(404).json({
                success: false,
                message: "Leader not found."
            });
        }

        if (name !== undefined) leader.name = name;
        if (photoUrl !== undefined) leader.photoUrl = photoUrl;
        if (designation !== undefined) leader.designation = designation;
        if (message !== undefined) leader.message = message;

        await leader.save();

        return res.status(200).json({
            success: true,
            message: "Leader updated successfully.",
            data: leader
        });
    } catch (error) {
        console.error("[Leader Controller] Update Leader:", error.message);
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
// Currently only the MongoDB record is deleted.
// Profile photo removal from Cloudinary will be
// implemented after Cloudinary integration.
export const deleteLeader = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid leader id."
            });
        }

        const leader = await Leader.findByIdAndDelete(id);

        if (!leader) {
            return res.status(404).json({
                success: false,
                message: "Leader not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Leader deleted successfully."
        });
    } catch (error) {
        console.error("[Leader Controller] Delete Leader:", error.message);
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
        console.error("[Leader Controller] Reorder Leader:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};