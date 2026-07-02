import Setting from "../models/Setting.model.js";


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

    if (
        !Array.isArray(data.phone) ||
        data.phone.length === 0
    ) {
        errors.phone = "At least one phone number is required.";
    } else {
        const phoneRegex = /^[+]?[\d\s\-()]{8,20}$/;

        const invalidPhone = data.phone.find(
            (phone) =>
                !phone?.trim() ||
                !phoneRegex.test(phone.trim())
        );

        if (invalidPhone) {
            errors.phone = "One or more phone numbers are invalid.";
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

        const settings = await Setting.findOne();

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

        const settings = await Setting.findOne().select(
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
 */
export const updateSettings = async (req, res) => {
    try {

        const validationErrors = validateSettings(req.body);

        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: validationErrors
            });
        }

        const {
            phone,
            email,
            instagramUrl,
            facebookUrl,
            youtubeUrl,
            showCtaBanner
        } = req.body;

        const settings = await Setting.findOneAndUpdate(
            {},
            {
                phone,
                email: email.toLowerCase(),
                instagramUrl,
                facebookUrl,
                youtubeUrl,
                showCtaBanner
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
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};