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
 * - Fetch all TC records, with optional search.
 * - Update an existing TC record.
 * - Delete a TC record.
 * - Public, rate-limited lookup by admission number.
 *
 * Notes:
 * Both Super Admin and Principal can manage TCs — no requireRole
 * restriction on the admin routes.
 * The public lookup route returns ONLY the pdfUrl — no student name
 * or other fields — since it requires no authentication and the
 * admission number alone is treated as the lookup credential.
 */

/**
 * Builds the MongoDB filter object for certificate search.
 * Supports searching by admission number or student name.
 */
const certificateFilter = (query) => {
  const filter = {};

  if (query.search?.trim()) {
    filter.$or = [
      { admissionNumber: { $regex: query.search.trim(), $options: "i" } },
      { studentName: { $regex: query.search.trim(), $options: "i" } }
    ];
  }

  return filter;
};

/**
 * GET /api/transfer-certificates
 * Admin-facing. Supports ?search= query param.
 */
export const getCertificates = async (req, res) => {
  try {
    const filter = certificateFilter(req.query);
    const certificates = await TransferCertificate.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Transfer certificates retrieved successfully.",
      data: certificates
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

/**
 * POST /api/transfer-certificates
 * Admin-facing. Rejects if a certificate for this admission number already exists.
 */
export const createCertificate = async (req, res) => {
  try {
    const { admissionNumber, studentName, pdfUrl, cloudinaryPublicId } = req.body;

    if (
      !admissionNumber?.trim() ||
      !studentName?.trim() ||
      !pdfUrl?.trim() ||
      !cloudinaryPublicId?.trim()
    ) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const isExistAdmissionNumber = await TransferCertificate.findOne({ admissionNumber });

    if (isExistAdmissionNumber) {
      return res.status(409).json({
        success: false,
        message: "A transfer certificate already exists for this admission number."
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
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

/**
 * PATCH /api/transfer-certificates/:id
 * Admin-facing. Admission number cannot be changed once created.
 */
export const updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid certificate ID." });
    }

    const { studentName, pdfUrl, cloudinaryPublicId } = req.body;
    const certificate = await TransferCertificate.findById(id);

    if (!certificate) {
      return res.status(404).json({ success: false, message: "Transfer certificate not found." });
    }

    if (studentName !== undefined) {
      if (!studentName.trim()) {
        return res.status(400).json({ success: false, message: "Student name cannot be empty." });
      }
      certificate.studentName = studentName;
    }

    if (pdfUrl !== undefined) {
      if (!pdfUrl.trim()) {
        return res.status(400).json({ success: false, message: "PDF URL cannot be empty." });
      }
      certificate.pdfUrl = pdfUrl;
    }

    if (cloudinaryPublicId !== undefined) {
      if (!cloudinaryPublicId.trim()) {
        return res.status(400).json({ success: false, message: "Cloudinary Public ID cannot be empty." });
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
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

/**
 * DELETE /api/transfer-certificates/:id
 * Admin-facing.
 */
export const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid certificate ID." });
    }

    const certificate = await TransferCertificate.findByIdAndDelete(id);

    if (!certificate) {
      return res.status(404).json({ success: false, message: "Transfer certificate not found." });
    }

    // Cloudinary deletion deferred until upload integration exists —
    // only the MongoDB record is removed for now.

    return res.status(200).json({ success: true, message: "Transfer certificate deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

/**
 * GET /api/transfer-certificates/lookup/:admissionNumber
 * Public-facing. No auth. Rate-limited.
 */
export const lookupCertificateByAdmissionNumber = async (req, res) => {
  try {
    const { admissionNumber } = req.params;

    if (!admissionNumber?.trim()) {
      return res.status(400).json({ success: false, message: "Admission number is required." });
    }

    const certificate = await TransferCertificate.findOne({ admissionNumber });

    if (!certificate) {
      return res.status(404).json({ success: false, message: "Transfer certificate not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Transfer certificate found.",
      pdfUrl: certificate.pdfUrl
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};