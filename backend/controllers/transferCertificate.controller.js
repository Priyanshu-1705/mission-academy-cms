import TransferCertificate from "../models/TransferCertificate.model.js";
import { isValidObjectId } from "../utils/isValidObjectId.util.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.util.js";

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
    console.error(
      "[Transfer Certificate Controller] Get Certificates:",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

/**
 * POST /api/transfer-certificates
 * Now expects a real PDF file (multipart/form-data) instead of a
 * JSON pdfUrl/cloudinaryPublicId pair.
 */
export const createCertificate = async (req, res) => {
  try {
    const { admissionNumber, studentName } = req.body;

    if (!admissionNumber?.trim() || !studentName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Admission number and student name are required."
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Certificate PDF is required."
      });
    }

    const isExistAdmissionNumber = await TransferCertificate.findOne({ admissionNumber });

    if (isExistAdmissionNumber) {
      return res.status(409).json({
        success: false,
        message: "A transfer certificate already exists for this admission number."
      });
    }

    const { url, publicId } = await uploadToCloudinary(req.file.buffer, "transfer-certificates", "raw");

    const certificate = await TransferCertificate.create({
      admissionNumber: admissionNumber.trim(),
      studentName: studentName.trim(),
      pdfUrl: url,
      cloudinaryPublicId: publicId
    });

    return res.status(201).json({
      success: true,
      message: "Transfer certificate created successfully.",
      data: certificate
    });
  } catch (error) {
    console.error("[Transfer Certificate Controller] Create Certificate:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

/**
 * PATCH /api/transfer-certificates/:id
 * A new PDF file is optional — this is the "Replace" action when provided.
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

    const { studentName } = req.body;
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
      certificate.studentName = studentName.trim();
    }

    if (req.file) {
      const { url, publicId } = await uploadToCloudinary(req.file.buffer, "transfer-certificates", "raw");

      try {
        await deleteFromCloudinary(certificate.cloudinaryPublicId, "raw");
      } catch (cloudinaryError) {
        console.error(
          "[Transfer Certificate Controller] Failed to delete previous PDF:",
          certificate._id.toString(),
          cloudinaryError.message
        );
      }

      certificate.pdfUrl = url;
      certificate.cloudinaryPublicId = publicId;
    }

    await certificate.save();

    return res.status(200).json({
      success: true,
      message: "Transfer certificate updated successfully.",
      data: certificate
    });
  } catch (error) {
    console.error("[Transfer Certificate Controller] Update Certificate:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

/**
 * DELETE /api/transfer-certificates/:id
 * Now actually deletes the Cloudinary PDF too.
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

    try {
      await deleteFromCloudinary(certificate.cloudinaryPublicId, "raw");
    } catch (cloudinaryError) {
      console.error(
        "[Transfer Certificate Controller] Failed to delete PDF on certificate delete:",
        certificate._id.toString(),
        cloudinaryError.message
      );
    }

    return res.status(200).json({
      success: true,
      message: "Transfer certificate deleted successfully."
    });
  } catch (error) {
    console.error("[Transfer Certificate Controller] Delete Certificate:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
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
      return res.status(400).json({
        success: false,
        message: "Admission number is required."
      });
    }

    const certificate = await TransferCertificate.findOne({ admissionNumber });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Transfer certificate not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transfer certificate found.",
      pdfUrl: certificate.pdfUrl
    });
  } catch (error) {
    console.error(
      "[Transfer Certificate Controller] Lookup Certificate:",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};