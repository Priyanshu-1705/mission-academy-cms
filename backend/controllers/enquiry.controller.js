import Enquiry from "../models/Enquiry.model.js";
import { isValidObjectId } from "../utils/isValidObjectId.util.js";

const VALID_STATUS = ["pending", "resolved"];

/**
 * Enquiry Controller
 *
 * Purpose:
 * Handles all CRUD operations for contact form enquiries.
 *
 * Responsibilities:
 * - Create a new enquiry (public-facing).
 * - Fetch enquiries (admin-facing, with optional status filtering).
 * - Update an enquiry's status (admin-facing).
 * - Delete an enquiry (admin-facing).
 *
 * Notes:
 * Only Super Admin and Principal can view, update, or delete enquiries.
 */

/**
 * Builds the MongoDB filter object for enquiries.
 *
 * Supports:
 * - status (pending, resolved)
 */
const buildEnquiryFilter = (query) => {
    const filter = {};

    if (
        query.status &&
        !VALID_STATUS.includes(query.status.trim())
    ) {
        throw new Error("Invalid enquiry status.");
    }

    if (query.status?.trim()) {
        filter.status = query.status.trim();
    }

    return filter;
};

const fetchEnquiries = async (query) => {

    const filter = buildEnquiryFilter(query);

    return Enquiry.find(filter).sort({
        createdAt: -1
    });

};

/**
 * GET /api/enquiries
 * Optional query param: ?status=pending
 * Admin-facing. Protected route.
 */
export const getEnquiries = async (req, res) => {
    try {
        const enquiries = await fetchEnquiries(req.query);

        return res.status(200).json({
            success: true,
            message: "Enquiries retrieved successfully.",
            data: enquiries
        });
    } catch (error) {
        console.error(
            "[Enquiry Controller] Get Enquiries:",
            error.message
        );
        if (error.message === "Invalid enquiry status.") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * Validates enquiry data.
 *
 * Returns:
 * - null if valid
 * - error message if invalid
 */
const validateEnquiry = (data) => {
    const errors = {};

    if (!data.name?.trim()) {
        errors.name = "Name is required.";
    } else if (data.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters long.";
    }

    if (!data.phone?.trim()) {
        errors.phone = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(data.phone)) {
        errors.phone = "Please enter a valid 10-digit phone number.";
    }

    if (!data.email?.trim()) {
        errors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
        errors.email = "Please enter a valid email address.";
    }

    if (!data.message?.trim()) {
        errors.message = "Message is required.";
    } else if (data.message.trim().length < 10) {
        errors.message = "Message must be at least 10 characters long.";
    } else if (data.message.trim().length > 500) {
        errors.message = "Message cannot exceed 500 characters.";
    }

    return errors;
};

/**
 * POST /api/public/enquiries
 * Public-facing. No auth required.
 *
 * Creates a new enquiry from the contact form.
 */
export const createEnquiry = async (req, res) => {
    try {
        const { name, phone, email, message } = req.body;
        const validationErrors = validateEnquiry(req.body);

        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: validationErrors
            });
        }

        const enquiry = await Enquiry.create({
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim(),
            status: "pending"
        });

        return res.status(201).json({
            success: true,
            message: "Enquiry submitted successfully.",
            data: enquiry
        });
    } catch (error) {
        console.error(
            "[Enquiry Controller] Create Enquiry:",
            error.message
        );
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * PATCH /api/enquiries/:id/status
 * Admin-facing. Protected route.
 *
 * Updates the status of an enquiry.
 */
export const updateEnquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid enquiry ID." });
        }

        if (!status || !VALID_STATUS.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status provided. Must be 'pending' or 'resolved'."
            });
        }

        const enquiry = await Enquiry.findById(id);

        if (!enquiry) {
            return res.status(404).json({ success: false, message: "Enquiry not found." });
        }

        enquiry.status = status;
        await enquiry.save();

        return res.status(200).json({
            success: true,
            message: "Enquiry status updated successfully.",
            data: enquiry
        });
    } catch (error) {
        console.error("[Enquiry Controller] Update Enquiry Status:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

/**
 * DELETE /api/enquiries/:id
 * Admin-facing. Protected route.
 *
 * Deletes an enquiry.
 */
export const deleteEnquiry = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid enquiry ID."
            });
        }

        const enquiry = await Enquiry.findByIdAndDelete(id);

        if (!enquiry) {
            return res.status(404).json({
                success: false,
                message: "Enquiry not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Enquiry deleted successfully."
        });
    } catch (error) {
        console.error(
            "[Enquiry Controller] Delete Enquiry:",
            error.message
        );
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};
