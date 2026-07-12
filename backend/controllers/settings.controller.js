import Settings from "../models/Settings.model.js";

/**
 * Settings Controller
 *
 * Purpose:
 * Handles all CRUD operations for global website settings.
 *
 * Responsibilities:
 * - Fetch settings (admin and public), auto-creating a default
 *   document on the very first read so this never returns null.
 * - Update settings (admin only), upserting the singleton document.
 *
 * Notes:
 * There should only ever be ONE document in the Settings collection.
 * Schema-level validators (see Settings.model.js) already guard
 * against malformed phone/email values regardless of which code path
 * writes to this model — validateSettings below is a second layer,
 * giving cleaner, field-specific error messages back to the admin
 * before the request ever reaches the database.
 */

const validateSettings = (data) => {
    const errors = {};

    if (data.phone && data.phone.trim() !== "") {
        const phoneRegex = /^[+\d][\d\s\-()]{6,20}(,\s*[+\d][\d\s\-()]{6,20})*$/;
        if (!phoneRegex.test(data.phone.trim())) {
            errors.phone = "Invalid phone number.";
        }
    }

    if (data.email && data.email.trim() !== "") {
        if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) {
            errors.email = "Invalid email address.";
        }
    }

    const urlFields = ["instagramUrl", "facebookUrl", "youtubeUrl"];

    for (const field of urlFields) {
        if (data[field] && !/^https?:\/\/.+/i.test(data[field])) {
            errors[field] = "Invalid URL.";
        }
    }

    if (data.showCtaBanner !== undefined && typeof data.showCtaBanner !== "boolean") {
        errors.showCtaBanner = "showCtaBanner must be true or false.";
    }

    return errors;
};

/**
 * GET /api/settings
 * Protected. Returns the single settings document, creating a
 * default empty one on the very first call if none exists yet.
 */
export const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({});
        }

        return res.status(200).json({
            success: true,
            message: "Settings retrieved successfully.",
            data: settings
        });
    } catch (error) {
        console.error("[Settings Controller] Get Settings:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

/**
 * GET /api/public/settings
 * Public. Returns only the information required by the public
 * website's footer/contact sections. Same auto-create safety net.
 */
export const getPublicSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({});
        }

        const publicSettings = {
            phone: settings.phone,
            email: settings.email,
            instagramUrl: settings.instagramUrl,
            facebookUrl: settings.facebookUrl,
            youtubeUrl: settings.youtubeUrl,
            showCtaBanner: settings.showCtaBanner
        };

        return res.status(200).json({
            success: true,
            message: "Settings retrieved successfully.",
            data: publicSettings
        });
    } catch (error) {
        console.error("[Settings Controller] Get Public Settings:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

/**
 * PATCH /api/settings
 * Protected. Updates the singleton settings document, creating it
 * if it does not already exist. Supports partial updates.
 */
export const updateSettings = async (req, res) => {
    try {
        const existingSettings = await Settings.findOne();

        const mergedSettings = {
            ...(existingSettings?.toObject() || {}),
            ...req.body
        };

        const validationErrors = validateSettings(mergedSettings);

        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: validationErrors
            });
        }

        const settings = await Settings.findOneAndUpdate(
            {},
            {
                phone: mergedSettings.phone?.trim() ?? "",
                email: mergedSettings.email?.trim().toLowerCase() ?? "",
                instagramUrl: mergedSettings.instagramUrl?.trim(),
                facebookUrl: mergedSettings.facebookUrl?.trim(),
                youtubeUrl: mergedSettings.youtubeUrl?.trim(),
                showCtaBanner: mergedSettings.showCtaBanner
            },
            {
                returnDocument: "after",
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
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};