import Disclosure from "../models/Disclosure.model.js";
import { isValidObjectId } from "../utils/isValidObjectId.util.js";
const VALID_CATEGORIES = [
    "general_information",
    "documents_information",
    "results_academics",
    "staff_infrastructure"
];

/**
 * Disclosure Controller
 *
 * Purpose:
 * Handles all CRUD operations for mandatory public disclosure documents.
 *
 * Responsibilities:
 * - Create a new disclosure.
 * - Fetch disclosures (admin: all; public: same data, no auth), with
 * - Supports optional filtering by category using ?category=general_information
 * - Update an existing disclosure.
 * - Delete a disclosure.
 *
 * Notes:
 * Only the Super Admin can create, update, or delete disclosures.
 * PDFs are stored on Cloudinary.
 */

const buildDisclosureFilter = (query) => {
    const filter = {};

    if (query.category?.trim()) {
        filter.category = query.category.trim();
    }

    return filter;
};

const fetchDisclosures = async (query) => {

    const filter = buildDisclosureFilter(query);

    return Disclosure.find(filter).sort({
        category: 1,
        displayOrder: 1
    })

};


/**
 * GET /api/disclosures
 * Optional query param:?category=general_information
 * Admin-facing. Protected route.
 */
export const getDisclosures = async (req, res) => {
    try {
        const disclosures = await fetchDisclosures(req.query);
        return res.status(200).json({
            success: true,
            message: "Disclosures retrieved successfully.",
            data: disclosures
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * GET /api/public/disclosures
 * Optional query param: ?category=A: GENERAL INFORMATION
 * Public-facing. No auth required.
 */
export const getPublicDisclosures = async (req, res) => {
    try {
        const disclosures = await fetchDisclosures(req.query);
        return res.status(200).json({
            success: true,
            message: "Disclosures retrieved successfully.",
            data: disclosures
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * Validates disclosure data.
 *
 * Returns:
 * - null if valid
 * - error message if invalid
 */
const validateDisclosure = ({ title, category, pdfUrl, cloudinaryPublicId, displayOrder }) => {
    if (!title?.trim()) {
        return "Title is required.";
    }
    if (!documentCode?.trim()) {
        return "Document code is required.";
    }
    if (!category?.trim()) {
        return "Category is required.";
    }
    if (!VALID_CATEGORIES.includes(category)) {
        return "Invalid category.";
    }
    if (!pdfUrl?.trim()) {
        return "PDF URL is required.";
    }
    if (!cloudinaryPublicId?.trim()) {
        return "Cloudinary Public ID is required.";
    }
    if (
        !Number.isInteger(displayOrder) ||
        displayOrder < 0
    ) {
        return "Invalid display order.";
    }
    return null;
};

/**
 * POST /api/disclosures
 *
 * Creates a new disclosure.
 */
export const createDisclosure = async (req, res) => {
    try {
        const validationError = validateDisclosure(req.body);
        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const { title, documentCode, category, pdfUrl, cloudinaryPublicId, displayOrder } = req.body;

        const disclosure = await Disclosure.create({
            title,
            documentCode,
            category,
            pdfUrl,
            cloudinaryPublicId,
            displayOrder
        });

        return res.status(201).json({
            success: true,
            message: "Disclosure created successfully.",
            data: disclosure
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * PATCH /api/disclosures/:id
 *
 * Updates an existing disclosure.
 *
 * Supports partial updates. Only the fields provided in the request 
 * body are updated. After applying the updates, the complete document
 * is validated before saving.
 */
export const updateDisclosure = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid disclosure ID."
            });
        }

        const disclosure = await Disclosure.findById(id);

        if (!disclosure) {
            return res.status(404).json({
                success: false,
                message: "Disclosure not found."
            });
        }

        const { title, documentCode, category, pdfUrl, cloudinaryPublicId, displayOrder } = req.body;

        if (title !== undefined) {
            disclosure.title = title;
        }
        if (documentCode !== undefined) {
            disclosure.documentCode = documentCode;
        }
        if (category !== undefined) {
            disclosure.category = category;
        }
        if (pdfUrl !== undefined) {
            disclosure.pdfUrl = pdfUrl;
        }
        if (cloudinaryPublicId !== undefined) {
            disclosure.cloudinaryPublicId = cloudinaryPublicId;
        }
        if (displayOrder !== undefined) {
            disclosure.displayOrder = displayOrder;
        }

        const validationError = validateDisclosure(disclosure);
        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        await disclosure.save();

        return res.status(200).json({
            success: true,
            message: "Disclosure updated successfully.",
            data: disclosure
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * DELETE /api/disclosures/:id
 *
 * Deletes an existing disclosure.
 *
 * Admin-facing.
 *
 * Validates the disclosure ID before attempting deletion.
 * Currently only removes the MongoDB record. Cloudinary PDF
 * deletion will be added once Cloudinary integration is
 * implemented across the project.
 */
export const deleteDisclosure = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid disclosure ID."
            });
        }

        const disclosure = await Disclosure.findByIdAndDelete(id);

        if (!disclosure) {
            return res.status(404).json({
                success: false,
                message: "Disclosure not found."
            });
        }

        /**
         * TODO:
         * Delete the PDF from Cloudinary using
         * disclosure.cloudinaryPublicId once the
         * Cloudinary service is integrated.
         */

        return res.status(200).json({
            success: true,
            message: "Disclosure deleted successfully."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};
