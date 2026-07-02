import express from "express";
import protect from "../middleware/auth.middleware.js";
import { certificateLookupLimiter } from "../middleware/certificateLookupLimiter.middleware.js";
import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  lookupCertificateByAdmissionNumber
} from "../controllers/transferCertificate.controller.js";

/**
 * Transfer Certificate Routes
 *
 * Purpose:
 * Defines all HTTP endpoints for managing transfer certificates.
 *
 * Responsibilities:
 * - Mount admin routes behind protect (login required).
 * - Mount the public lookup route with no auth, but rate-limited.
 *
 * Notes:
 * Both Super Admin and Principal can manage TCs — no requireRole
 * restriction is applied to the admin routes.
 */

const router = express.Router();

// Public lookup route — no auth, but rate-limited.
// Final path: /api/transfer-certificates/lookup/:admissionNumber
router.get("/lookup/:admissionNumber", certificateLookupLimiter, lookupCertificateByAdmissionNumber);

// Admin routes — require a valid logged-in session.
router.get("/", protect, getCertificates);
router.post("/", protect, createCertificate);
router.patch("/:id", protect, updateCertificate);
router.delete("/:id", protect, deleteCertificate);

export default router;