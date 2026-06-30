import mongoose from "mongoose";
/**
 * Transfer Certificate Model
 *
 * Purpose:
 * Represents a single transfer certificate record.
 *
 * Responsibilities:
 * - Store student admission number and name.
 * - Public URL of the uploaded transfer certificate PDF.
 * - The actual file is stored on Cloudinary.
 * - Cloudinary public ID used when replacing or deleting
 * - the PDF so the storage stays clean.
 *
 * Notes:
 * Admission number is unique and indexed for fast lookups.
 * The actual PDF file is stored externally (e.g., Cloudinary).
 */
const tcSchema = new mongoose.Schema({
    admissionNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 50
    },
    studentName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    pdfUrl: {
        type: String,
        required: true,
        trim: true
    },
    cloudinaryPublicId: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

tcSchema.index({ admissionNumber: 1 });

const TransferCertificate = mongoose.model("TransferCertificate", tcSchema);

export default TransferCertificate;
