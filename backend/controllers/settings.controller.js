import Settings from "../models/Settings.model.js";


/**
 * Settings Controller
 *
 * Purpose:
 * Handles all CRUD operations for global website settings.
 *
 * Responsibilities:
 * - Fetch settings (admin and public).
 * - Update settings (admin only).
 *
 * Notes:
 * There should only ever be ONE document in the Settings collection.
 * Only Super Admin can update these settings.
 */

/**
 * Validates settings data.
 *
 * Returns:
 * - An object containing validation errors, or an empty object if valid.
 */
const validateSettings = (data) => {
    const errors = {};

    if (!data.phone?.trim()) {
        errors.phone = "Phone number is required.";
    } else {
        const phoneRegex = /^[+]?[\d\s\-()]{8,20}$/;

        if (!phoneRegex.test(data.phone.trim())) {
            errors.phone = "Invalid phone number.";
        }
    }

    if (!data.email?.trim()) {
        errors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
        errors.email = "Invalid email address.";
    }

    const urlFields = [
        "instagramUrl",
        "facebookUrl",
        "youtubeUrl",
    ];

    for (const field of urlFields) {
        if (
            data[field] &&
            !/^https?:\/\/.+/i.test(data[field])
        ) {
            errors[field] = "Invalid URL.";
        }
    }

    if (
        data.showCtaBanner !== undefined &&
        typeof data.showCtaBanner !== "boolean"
    ) {
        errors.showCtaBanner = "showCtaBanner must be true or false.";
    }

    return errors;
};

/**
 * GET /api/settings
 *
 * Protected.
 *
 * Returns the single settings document.
 */
export const getSettings = async (req, res) => {
    try {

        const settings = await Settings.findOne();

        return res.status(200).json({
            success: true,
            message: "Settings retrieved successfully.",
            data: settings
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

/**
 * GET /api/public/settings
 *
 * Public.
 *
 * Returns only the information required
 * by the public website.
 */
export const getPublicSettings = async (req, res) => {
    try {

        const settings = await Settings.findOne().select(
            "phone email instagramUrl facebookUrl youtubeUrl showCtaBanner"
        );

        return res.status(200).json({
            success: true,
            message: "Settings retrieved successfully.",
            data: settings
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

/**
 * PATCH /api/settings
 *
 * Protected.
 *
 * Updates the singleton settings document.
 * Creates it if it does not already exist.
 * Supports partial updates.
 */
export const updateSettings = async (req, res) => {
    try {

        // Get existing settings (if any)
        const existingSettings = await Settings.findOne();

        // Merge existing data with incoming request body
        const mergedSettings = {
            ...(existingSettings?.toObject() || {}),
            ...req.body
        };

        // Validate the merged document
        const validationErrors = validateSettings(mergedSettings);

        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: validationErrors
            });
        }

        // Update or create the singleton settings document
        const settings = await Settings.findOneAndUpdate(
            {},
            {
                phone: mergedSettings.phone.trim(),
                email: mergedSettings.email.trim().toLowerCase(),
                instagramUrl: mergedSettings.instagramUrl?.trim(),
                facebookUrl: mergedSettings.facebookUrl?.trim(),
                youtubeUrl: mergedSettings.youtubeUrl?.trim(),
                showCtaBanner: mergedSettings.showCtaBanner
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Settings updated successfully.",
            data: settings
        });

    } catch (error) {
        console.error("[Settings Controller] Update Settings:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};