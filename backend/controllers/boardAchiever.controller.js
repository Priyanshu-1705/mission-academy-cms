import BoardAchiever from "../models/BoardAchiever.model.js";
import { isValidObjectId } from "../utils/isValidObjectId.util.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.util.js";

/**
 * Board Achiever Controller
 *
 * Purpose:
 * Handles all CRUD operations for Board Achievers.
 *
 * Responsibilities:
 * - Create a new board achiever.
 * - Fetch board achievers (admin and public).
 * - Update an existing board achiever.
 * - Delete a board achiever.
 *
 * Notes:
 * Images are stored on Cloudinary.
 * Duplicate ranks within the same class and academic year
 * are not allowed.
 */

/**
 * Builds the MongoDB filter object for searching and filtering
 * board achievers.
 *
 * Supports:
 * - search (studentName, className, year)
 * - className
 * - year
 */
const buildBoardAchieverFilter = (query) => {
    const filter = {};

    if (query.search?.trim()) {
        filter.$or = [
            {
                studentName: {
                    $regex: query.search.trim(),
                    $options: "i"
                }
            },
            {
                className: {
                    $regex: query.search.trim(),
                    $options: "i"
                }
            },
            {
                year: {
                    $regex: query.search.trim(),
                    $options: "i"
                }
            }
        ];
    }

    if (query.className?.trim()) {
        filter.className = query.className.trim();
    }

    if (query.year?.trim()) {
        filter.year = query.year.trim();
    }

    return filter;
};

/**
 * Shared helper used by both admin and public GET APIs.
 */
const fetchBoardAchievers = async (query) => {

    const filter = buildBoardAchieverFilter(query);

    return BoardAchiever.find(filter).sort({
        year: -1,
        className: 1,
        rank: 1
    });

};

/**
 * Validates board achiever data.
 *
 * Returns:
 * - null if valid
 * - error message if invalid
 */
const validateBoardAchiever = ({
    studentName,
    className,
    percentage,
    rank,
    year,
}) => {

    if (!studentName?.trim()) {
        return "Student name is required.";
    }

    if (!["Class X", "Class XII"].includes(className)) {
        return "Invalid class.";
    }

    if (
        !Number.isFinite(percentage) ||
        percentage < 0 ||
        percentage > 100
    ) {
        return "Percentage must be between 0 and 100.";
    }

    if (
        !Number.isInteger(rank) ||
        rank < 1
    ) {
        return "Rank must be a positive integer.";
    }

    if (!/^\d{4}-\d{2}$/.test(year)) {
        return "Academic year must be in the format YYYY-YY.";
    }
    return null;
};

/**
 * Checks whether another board achiever already has the
 * same class, academic year and rank.
 *
 * currentId is ignored during updates.
 */
const checkDuplicateRank = async (
    className,
    year,
    rank,
    currentId = null
) => {

    const existing = await BoardAchiever.findOne({
        className,
        year,
        rank
    });

    if (!existing) {
        return false;
    }

    if (
        currentId &&
        existing._id.toString() === currentId.toString()
    ) {
        return false;
    }

    return true;
};

/**
 * GET /api/board-achievers
 *
 * Admin-facing.
 *
 * Supports:
 * - ?search=
 * - ?className=
 * - ?year=
 */
export const getBoardAchievers = async (req, res) => {
    try {

        const achievers = await fetchBoardAchievers(req.query);

        return res.status(200).json({
            success: true,
            message: "Board achievers retrieved successfully.",
            data: achievers
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

/**
 * GET /api/public/board-achievers
 *
 * Public-facing.
 *
 * Supports:
 * - ?search=
 * - ?className=
 * - ?year=
 */
export const getPublicBoardAchievers = async (req, res) => {
    try {

        const achievers = await fetchBoardAchievers(req.query);

        return res.status(200).json({
            success: true,
            message: "Board achievers retrieved successfully.",
            data: achievers
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

/**
 * POST /api/board-achievers
 *
 * Creates a new board achiever.
 */
export const createBoardAchiever = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Student photo is required."
            });
        }

        const {
            studentName,
            className,
            year
        } = req.body;

        // Convert multipart/form-data values to numbers
        const percentage = Number(req.body.percentage);
        const rank = Number(req.body.rank);

        // Validate user-provided fields
        const validationError = validateBoardAchiever({
            studentName,
            className,
            percentage,
            rank,
            year
        });

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        // Prevent duplicate rank for the same class and academic year
        const duplicateRank = await checkDuplicateRank(
            className.trim(),
            year.trim(),
            rank
        );

        if (duplicateRank) {
            return res.status(409).json({
                success: false,
                message: "This rank already exists for the selected class and academic year."
            });
        }

        // Upload student photo to Cloudinary
        const { url, publicId } = await uploadToCloudinary(
            req.file.buffer,
            "board-achievers",
            "image"
        );

        // Save achiever
        const achiever = await BoardAchiever.create({
            studentName: studentName.trim(),
            className: className.trim(),
            percentage,
            rank,
            year: year.trim(),
            imageUrl: url,
            cloudinaryPublicId: publicId
        });

        return res.status(201).json({
            success: true,
            message: "Board achiever created successfully.",
            data: achiever
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};


/**
 * PATCH /api/board-achievers/:id
 *
 * Updates an existing board achiever.
 *
 * Supports partial updates. Only the fields provided in the request
 * body are updated. After applying the updates, the complete document
 * is validated before saving.
 */
export const updateBoardAchiever = async (req, res) => {
    try {

        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid board achiever id."
            });
        }

        const achiever = await BoardAchiever.findById(id);

        if (!achiever) {
            return res.status(404).json({
                success: false,
                message: "Board achiever not found."
            });
        }

        if (req.file) {
            const { url, publicId } = await uploadToCloudinary(req.file.buffer, "board-achievers", "image");

            try {
                await deleteFromCloudinary(achiever.cloudinaryPublicId, "image");
            } catch (cloudinaryError) {
                console.error("[Board Achiever Controller] Failed to delete previous image:", {
                    achieverId: achiever._id,
                    publicId: achiever.cloudinaryPublicId,
                    error: cloudinaryError.message
                });
            }

            achiever.imageUrl = url;
            achiever.cloudinaryPublicId = publicId;
        }

        const {
            studentName,
            className,
            percentage,
            rank,
            year,
        } = req.body;

        /**
         * Apply only the fields that were sent.
         */

        if (studentName !== undefined) {
            achiever.studentName = studentName.trim();
        }

        if (className !== undefined) {
            achiever.className = className.trim();
        }

        if (percentage !== undefined) {
            achiever.percentage = percentage;
        }

        if (rank !== undefined) {
            achiever.rank = rank;
        }

        if (year !== undefined) {
            achiever.year = year.trim();
        }

        /**
         * Validate the completed document.
         */

        const validationError = validateBoardAchiever(achiever);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        /**
         * Ensure another achiever doesn't already use the same
         * class + year + rank combination.
         */

        const duplicateRank = await checkDuplicateRank(
            achiever.className,
            achiever.year,
            achiever.rank,
            achiever._id
        );

        if (duplicateRank) {
            return res.status(409).json({
                success: false,
                message:
                    "This rank already exists for the selected class and academic year."
            });
        }

        await achiever.save();

        return res.status(200).json({
            success: true,
            message: "Board achiever updated successfully.",
            data: achiever
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

/**
 * DELETE /api/board-achievers/:id
 *
 * Deletes an existing board achiever.
 *
 * Admin-facing.
 *
 * Validates the board achiever ID before attempting deletion.
 * Currently only removes the MongoDB record. Cloudinary image
 * deletion will be added once Cloudinary integration is
 * implemented across the project.
 */
export const deleteBoardAchiever = async (req, res) => {
    try {

        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid board achiever id."
            });
        }

        const achiever = await BoardAchiever.findByIdAndDelete(id);

        if (!achiever) {
            return res.status(404).json({
                success: false,
                message: "Board achiever not found."
            });
        }

        try {
            await deleteFromCloudinary(achiever.cloudinaryPublicId, "image");
        } catch (cloudinaryError) {
            console.error("[Board Achiever Controller] Failed to delete image on achiever delete:", {
                achieverId: achiever._id,
                publicId: achiever.cloudinaryPublicId,
                error: cloudinaryError.message
            });
        }

        return res.status(200).json({
            success: true,
            message: "Board achiever deleted successfully."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};