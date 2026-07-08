import mongoose from "mongoose";

/**
 * Transfer Certificate Model
 *
 * Purpose:
 * Represents a single transfer certificate record.
 *
 * Responsibilities:
 * - Store student admission number and name.
 * - Store the public URL of the uploaded transfer certificate PDF.
 *
 * Notes:
 * Admission number is unique and indexed for fast lookups — this is
 * the field the public, no-auth lookup endpoint searches by.
 * The actual PDF file is stored externally (Cloudinary once
 * integrated); cloudinaryPublicId is kept so the file can be
 * replaced or deleted from storage later, not just the DB record.
 */
const tcSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true
  }
);

const TransferCertificate = mongoose.model("TransferCertificate", tcSchema);

export default TransferCertificate;