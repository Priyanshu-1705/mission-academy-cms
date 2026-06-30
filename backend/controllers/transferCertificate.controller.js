import TransferCertificate from "../models/TransferCertificate.model.js";
import { isValidObjectId } from "../utils/isValidObjectId.util.js";

/**
 * Transfer Certificate Controller
 *
 * Purpose:
 * Handles all CRUD operations for Transfer Certificates (TCs).
 *
 * Responsibilities:
 * - Create a new TC record.
 * - Fetch all TC records.
 * - Fetch a single TC record by ID.
 * - Update an existing TC record.
 * - Delete a TC record.
 *
 * Notes:
 * Only Super Admin and Principal can manage TCs.
 * TCs are primarily records of generated PDFs, with the PDF itself
 * stored externally (e.g., Cloudinary) and referenced by a URL.
 */



/**
 * Builds the MongoDB filter object for certificate search.
 *
 * Currently supports:
 * - Admission Number
 * - Student Name
 *
 * Can easily be extended later with:
 * - Upload Date
 * - Academic Year
 * - Status
 */
const certificateFilter = (query) => {
    const filter = {};

    if (query.search?.trim()) {
        filter.$or = [
            {
                admissionNumber: {
                    $regex: query.search.trim(),
                    $options: "i"
                }
            },
            {
                studentName: {
                    $regex: query.search.trim(),
                    $options: "i"
                }
            }
        ];
    }

    return filter;
};

/**
 * GET /api/transfer-certificates
 *
 * Admin-facing.
 *
 * Returns all transfer certificates.
 * Supports optional searching using the `search` query parameter.
 *
 * Examples:
 * GET /api/transfer-certificates
 * GET /api/transfer-certificates?search=MA2023001
 * GET /api/transfer-certificates?search=Rahul
 */
export const getCertificates = async (req, res) => {
    try {
        const filter = certificateFilter(req.query);

        const certificates = await TransferCertificate
            .find(filter)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Transfer certificates retrieved successfully.",
            data: certificates
        });

    } catch (error) {
        console.error("[Transfer Certificate Controller] Get Certificates:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * POST /api/transfer-certificates
 *
 * Admin-facing.
 *
 * Creates a new transfer certificate record.
 * Expects admissionNumber, studentName, pdfUrl, and cloudinaryPublicId.
 */
export const createCertificate = async (req, res) => {
    try {
        const { admissionNumber, studentName, pdfUrl, cloudinaryPublicId } = req.body;
        if (!admissionNumber || !studentName || !pdfUrl || !cloudinaryPublicId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const isExistAdmissionNumber = await TransferCertificate.findOne({ admissionNumber });

        if (isExistAdmissionNumber) {
            return res.status(409).json({
                success: false,
                message:
                    "A transfer certificate already exists for this admission number."
            });
        }

        const certificate = await TransferCertificate.create({
            admissionNumber,
            studentName,
            pdfUrl,
            cloudinaryPublicId
        });

        return res.status(201).json({
            success: true,
            message: "Transfer certificate created successfully.",
            data: certificate
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

/**
 * PATCH /api/transfer-certificates/:id
 *
 * Admin-facing.
 *
 * Updates an existing transfer certificate record.
 * Allows updating studentName, pdfUrl, and cloudinaryPublicId.
 * Admission number cannot be changed once created.
 */
export const updateCertificate = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid certificate ID."
            });
        }

        const { studentName, pdfUrl, cloudinaryPublicId } = req.body;

        const certificate = await TransferCertificate.findById(id);

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: "Transfer certificate not found."
            });
        }

        if (studentName !== undefined) {
            if (!studentName.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Student name cannot be empty."
                });
            }
            certificate.studentName = studentName;
        }

        if (pdfUrl !== undefined) {
            if (!pdfUrl.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "PDF URL cannot be empty."
                });
            }
            certificate.pdfUrl = pdfUrl;
        }

        if (cloudinaryPublicId !== undefined) {
            if (!cloudinaryPublicId.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Cloudinary Public ID cannot be empty."
                });
            }
            certificate.cloudinaryPublicId = cloudinaryPublicId;
        }

        await certificate.save();

        return res.status(200).json({
            success: true,
            message: "Transfer certificate updated successfully.",
            data: certificate
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * DELETE /api/transfer-certificates/:id
 *
 * Admin-facing.
 *
 * Deletes a transfer certificate record.
 * This also needs to trigger deletion of the PDF from Cloudinary.
 */
export const deleteCertificate = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid certificate ID."
            });
        }

        const certificate = await TransferCertificate.findByIdAndDelete(id);

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: "Transfer certificate not found."
            });
        }

        // Cloudinary deletion will be added once the
        // Cloudinary upload service is integrated.
        // For now only the MongoDB record is removed.

        return res.status(200).json({
            success: true,
            message: "Transfer certificate deleted successfully."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

/**
 * GET /api/public/transfer-certificates/:admissionNumber
 *
 * Public-facing. No auth required.
 *
 * Looks up a transfer certificate by its admission number.
 * This endpoint is rate-limited to prevent abuse.
 */
export const lookupCertificateByAdmissionNumber = async (req, res) => {
    try {
        const { admissionNumber } = req.params;

        if(!admissionNumber?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Admission number is required."
            })
        }

        const certificate = await TransferCertificate.findOne({ admissionNumber });

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: "Transfer certificate not found."
            })
        }

        return res.status(200).json({
            success: true,
            message: "Transfer certificate found.",
            pdfUrl: certificate.pdfUrl
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        })
    }
}