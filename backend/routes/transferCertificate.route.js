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
 * - Mount admin routes behind protect + requireRole("super_admin", "principal").
 * - Mount the public lookup route with no auth, but with rate limiting.
 *
 * Notes:
 * Both Super Admin and Principal can manage TCs.
 */

const router = express.Router();

// Public lookup route — no auth, but rate-limited.
router.get("/transfer-certificates/:admissionNumber", certificateLookupLimiter, lookupCertificateByAdmissionNumber);


// Admin routes — require a valid logged-in session.
router.get("/", protect, getCertificates);
router.post("/", protect, createCertificate);
router.patch("/:id", protect, updateCertificate);
router.delete("/:id", protect, deleteCertificate);

export default router;
