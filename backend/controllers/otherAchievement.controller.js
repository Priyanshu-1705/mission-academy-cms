import OtherAchievement from "../models/OtherAchievement.model.js";
import { isValidObjectId } from "../utils/isValidObjectId.util.js";

/**
 * Other Achievement Controller
 *
 * Purpose:
 * Handles all CRUD operations for "other" (non-board) achievements.
 *
 * Responsibilities:
 * - Create a new achievement.
 * - Fetch achievements (admin: all; public: homepage only).
 * - Update an existing achievement.
 * - Delete an achievement.
 *
 * Notes:
 * Images are stored on Cloudinary.
 * Only the Super Admin can create, update, or delete achievements.
 */

/**
 * Builds the MongoDB filter object for searching and filtering
 * other achievements.
 *
 * Supports:
 * - search (title, description, category)
 * - category
 * - showOnHomepage
 */
const buildOtherAchievementFilter = (query) => {
    const filter = {};

    if (query.search?.trim()) {
        filter.$or = [
            {
                title: {
                    $regex: query.search.trim(),
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: query.search.trim(),
                    $options: "i"
                }
            },
            {
                category: {
                    $regex: query.search.trim(),
                    $options: "i"
                }
            }
        ];
    }

    if (query.category?.trim()) {
        filter.category = query.category.trim();
    }

    if (query.showOnHomepage !== undefined) {
        filter.showOnHomepage = query.showOnHomepage === "true";
    }

    return filter;
};

/**
 * Shared helper used by both admin and public GET APIs.
 */
const fetchOtherAchievements = async (query, publicOnly = false) => {

    const filter = buildOtherAchievementFilter(query);

    if(publicOnly){
        filter.showOnHomepage = true;
    }

    return OtherAchievement.find(filter).sort({
        date: -1,
        createdAt: -1
    });

};

/**
 * Validates other achievement data.
 *
 * Returns:
 * - null if valid
 * - error message if invalid
 */
const validateOtherAchievement = ({
    title,
    description,
    category,
    date,
    imageUrl,
    cloudinaryPublicId
}) => {

    if (!title?.trim()) {
        return "Title is required.";
    } if (!description?.trim()) {
        return "Description is required.";
    }

    if (category && !["Sports", "Science", "Cultural", "Other"].includes(category)) {
        return "Invalid category.";
    }

    if (date && isNaN(new Date(date).getTime())) {
        return "Invalid date.";
    }

    if (!imageUrl?.trim()) {
        return "Image URL is required.";
    }

    if (!cloudinaryPublicId?.trim()) {
        return "Cloudinary Public ID is required.";
    }

    return null;
};

/**
 * GET /api/other-achievements
 *
 * Admin-facing.
 *
 * Supports:
 * - ?search=
 * - ?category=
 * - ?showOnHomepage=
 */
export const getOtherAchievements = async (req, res) => {
    try {

        const achievements = await fetchOtherAchievements(req.query);

        return res.status(200).json({
            success: true,
            message: "Other achievements retrieved successfully.",
            data: achievements
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

/**
 * GET /api/public/other-achievements
 *
 * Public-facing.
 *
 * Supports:
 * - ?search=
 * - ?category=
 */
export const getPublicOtherAchievements = async (req, res) => {
    try {

        const achievements = await fetchOtherAchievements(req.query, true);

        return res.status(200).json({
            success: true,
            message: "Other achievements retrieved successfully.",
            data: achievements
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

/**
 * POST /api/other-achievements
 *
 * Creates a new other achievement.
 */
export const createOtherAchievement = async (req, res) => {
    try {

        const validationError = validateOtherAchievement(req.body);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const {
            title,
            description,
            category,
            date,
            imageUrl,
            cloudinaryPublicId,
            showOnHomepage
        } = req.body;

        const achievement = await OtherAchievement.create({
            title,
            description,
            category,
            date,
            imageUrl,
            cloudinaryPublicId,
            showOnHomepage
        });

        return res.status(201).json({
            success: true,
            message: "Other achievement created successfully.",
            data: achievement
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

/**
 * PATCH /api/other-achievements/:id
 *
 * Updates an existing other achievement.
 *
 * Supports partial updates. Only the fields provided in the request
 * body are updated. After applying the updates, the complete document
 * is validated before saving.
 */
export const updateOtherAchievement = async (req, res) => {
    try {

        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid achievement id."
            });
        }

        const achievement = await OtherAchievement.findById(id);

        if (!achievement) {
            return res.status(404).json({
                success: false,
                message: "Other achievement not found."
            });
        }

        const {
            title,
            description,
            category,
            date,
            imageUrl,
            cloudinaryPublicId,
            showOnHomepage
        } = req.body;

        /**
         * Apply only the fields that were sent.
         */

        if (title !== undefined) {
            achievement.title = title;
        }

        if (description !== undefined) {
            achievement.description = description;
        }

        if (category !== undefined) {
            achievement.category = category;
        }

        if (date !== undefined) {
            achievement.date = date;
        }

        if (imageUrl !== undefined) {
            achievement.imageUrl = imageUrl;
        }

        if (cloudinaryPublicId !== undefined) {
            achievement.cloudinaryPublicId = cloudinaryPublicId;
        }

        if (showOnHomepage !== undefined) {
            achievement.showOnHomepage = showOnHomepage;
        }

        /**
         * Validate the completed document.
         */

        const validationError = validateOtherAchievement(achievement);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        await achievement.save();

        return res.status(200).json({
            success: true,
            message: "Other achievement updated successfully.",
            data: achievement
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

/**
 * DELETE /api/other-achievements/:id
 *
 * Deletes an existing other achievement.
 *
 * Admin-facing.
 *
 * Validates the achievement ID before attempting deletion.
 * Currently only removes the MongoDB record. Cloudinary image
 * deletion will be added once Cloudinary integration is
 * implemented across the project.
 */
export const deleteOtherAchievement = async (req, res) => {
    try {

        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid achievement id."
            });
        }

        const achievement = await OtherAchievement.findByIdAndDelete(id);

        if (!achievement) {
            return res.status(404).json({
                success: false,
                message: "Other achievement not found."
            });
        }

        /**
         * TODO:
         * Delete the image from Cloudinary using
         * achievement.cloudinaryPublicId once the
         * Cloudinary service is integrated.
         */

        return res.status(200).json({
            success: true,
            message: "Other achievement deleted successfully."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

/**
 * PATCH /api/other-achievements/:id/toggle-homepage
 *
 * Toggles the `showOnHomepage` status of an other achievement.
 */
export const toggleOtherAchievementHomepage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid achievement ID."
            });
        }

        const achievement = await OtherAchievement.findById(id);

        if (!achievement) {
            return res.status(404).json({
                success: false,
                message: "Other achievement not found."
            });
        }

        achievement.showOnHomepage = !achievement.showOnHomepage;
        await achievement.save();

        return res.status(200).json({
            success: true,
            message: "Other achievement homepage visibility toggled successfully.",
            data: achievement
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}