import Achievement from "../models/Achievement.model.js";
import { isValidObjectId } from "../utils/isValidObjectId.util.js";

/**
 * Achievement Controller
 *
 * Purpose:
 * Handles all CRUD operations for school achievements.
 *
 * Responsibilities:
 * - Create a new achievement.
 * - Fetch achievements (admin and public).
 * - Update an existing achievement.
 * - Delete an achievement.
 *
 * Notes:
 * Both Super Admin and Principal can manage achievements.
 * This module stores two types of achievements:
 *
 * 1. Board Achievers
 * 2. Other Achievements
 *
 * The controller performs business validation depending on
 * the selected achievement type.
 */

/**
 * Builds the MongoDB filter object for achievement search.
 *
 * Supports:
 * - Achievement Type
 * - Student Name
 * - Title
 * - Academic Year
 *
 * Future filters can easily be added here without modifying
 * the controller methods.
 */
const buildAchievementFilter = (query) => {
    const filter = {};

    if (query.achievementType) {
        filter.achievementType = query.achievementType;
    }

    if (query.search?.trim()) {
        filter.$or = [
            {
                title: {
                    $regex: query.search.trim(),
                    $options: "i"
                }
            },
            {
                studentName: {
                    $regex: query.search.trim(),
                    $options: "i"
                }
            },
            {
                academicYear: {
                    $regex: query.search.trim(),
                    $options: "i"
                }
            }
        ];
    }

    return filter;
};

/**
 * GET /api/achievements
 *
 * Admin-facing.
 *
 * Returns all achievements.
 *
 * Supports:
 * - ?search=
 * - ?achievementType=
 */
export const getAchievements = async (req, res) => {
    try {

        const filter = buildAchievementFilter(req.query);

        const achievements = await Achievement
            .find(filter)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Achievements retrieved successfully.",
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
 * GET /api/public/achievements
 *
 * Public-facing.
 *
 * Returns achievements visible on the public website.
 *
 * Supports:
 * - ?search=
 * - ?achievementType=
 *
 * No authentication required.
 */
export const getPublicAchievements = async (req, res) => {
    try {

        const filter = buildAchievementFilter(req.query);

        const achievements = await Achievement
            .find(filter)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Achievements retrieved successfully.",
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
 * POST /api/achievements
 *
 * Creates a new achievement.
 *
 * Business Rules:
 *
 * Board Achiever requires:
 * - studentName
 * - percentage
 * - rank
 * - className
 * - academicYear
 * - imageUrl
 * - cloudinaryPublicId
 *
 * Other Achievement requires:
 * - title
 * - imageUrl
 * - cloudinaryPublicId
 */
export const createAchievement = async (req, res) => {
    try {

        const {
            achievementType,
            title,
            description,
            studentName,
            percentage,
            rank,
            className,
            academicYear,
            imageUrl,
            cloudinaryPublicId
        } = req.body;

        // Validate achievement type.
        if (
            !achievementType ||
            !["board_achiever", "other"].includes(achievementType)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid achievement type."
            });
        }

        // Common required fields.
        if (!imageUrl?.trim() || !cloudinaryPublicId?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Image and Cloudinary Public ID are required."
            });
        }

        /**
         * Board Achiever Validation
         */
        if (achievementType === "board_achiever") {

            if (
                !studentName?.trim() ||
                percentage === undefined ||
                rank === undefined ||
                !className ||
                !academicYear?.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Student name, percentage, rank, class and academic year are required for board achievers."
                });
            }

            const achievement = await Achievement.create({
                achievementType,
                studentName,
                percentage,
                rank,
                className,
                academicYear,
                imageUrl,
                cloudinaryPublicId
            });

            return res.status(201).json({
                success: true,
                message: "Board achiever created successfully.",
                data: achievement
            });

        }

        /**
         * Other Achievement Validation
         */
        if (!title?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required for other achievements."
            });
        }

        const achievement = await Achievement.create({
            achievementType,
            title,
            description,
            imageUrl,
            cloudinaryPublicId
        });

        return res.status(201).json({
            success: true,
            message: "Achievement created successfully.",
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
 * PATCH /api/achievements/:id
 *
 * Updates an existing achievement.
 *
 * Supports partial updates.
 *
 * Business rules are revalidated after applying updates to ensure
 * the achievement still contains all required fields for its type.
 */
export const updateAchievement = async (req, res) => {
    try {

        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid achievement id."
            });
        }

        const achievement = await Achievement.findById(id);

        if (!achievement) {
            return res.status(404).json({
                success: false,
                message: "Achievement not found."
            });
        }

        const {
            achievementType,
            title,
            description,
            studentName,
            percentage,
            rank,
            className,
            academicYear,
            imageUrl,
            cloudinaryPublicId
        } = req.body;

        /**
         * Update fields only if they were sent.
         */

        if (achievementType !== undefined) {

            if (
                !["board_achiever", "other"].includes(achievementType)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid achievement type."
                });
            }

            achievement.achievementType = achievementType;
        }

        if (title !== undefined) {
            achievement.title = title;
        }

        if (description !== undefined) {
            achievement.description = description;
        }

        if (studentName !== undefined) {
            achievement.studentName = studentName;
        }

        if (percentage !== undefined) {
            achievement.percentage = percentage;
        }

        if (rank !== undefined) {
            achievement.rank = rank;
        }

        if (className !== undefined) {
            achievement.className = className;
        }

        if (academicYear !== undefined) {
            achievement.academicYear = academicYear;
        }

        if (imageUrl !== undefined) {

            if (!imageUrl.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Image URL cannot be empty."
                });
            }

            achievement.imageUrl = imageUrl;
        }

        if (cloudinaryPublicId !== undefined) {

            if (!cloudinaryPublicId.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Cloudinary Public ID cannot be empty."
                });
            }

            achievement.cloudinaryPublicId = cloudinaryPublicId;
        }

        /**
         * Revalidate according to the final achievement type.
         */

        if (achievement.achievementType === "board_achiever") {

            if (
                !achievement.studentName?.trim() ||
                achievement.percentage === undefined ||
                achievement.rank === undefined ||
                !achievement.className ||
                !achievement.academicYear?.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Board achievers must have student name, percentage, rank, class and academic year."
                });
            }

        } else {

            if (!achievement.title?.trim()) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Title is required for other achievements."
                });
            }

        }

        await achievement.save();

        return res.status(200).json({
            success: true,
            message: "Achievement updated successfully.",
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
 * DELETE /api/achievements/:id
 *
 * Deletes an existing achievement.
 *
 * Admin-facing.
 *
 * Validates the achievement ID before attempting deletion.
 * Currently only removes the MongoDB record. Cloudinary image
 * deletion will be added once Cloudinary integration is
 * implemented across the project.
 */
export const deleteAchievement = async (req, res) => {
    try {

        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid achievement id."
            });
        }

        const achievement = await Achievement.findByIdAndDelete(id);

        if (!achievement) {
            return res.status(404).json({
                success: false,
                message: "Achievement not found."
            });
        }

        // Cloudinary deletion will be added once the
        // Cloudinary upload service is integrated.
        // For now only the MongoDB record is removed.

        return res.status(200).json({
            success: true,
            message: "Achievement deleted successfully."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};