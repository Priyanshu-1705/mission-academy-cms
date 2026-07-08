import multer from "multer";

/**
 * Upload Middleware
 *
 * Purpose:
 * Configures multer to receive incoming file uploads (images and PDFs)
 * and make them available on req.file before the controller runs.
 *
 * Responsibilities:
 * - Store the uploaded file in memory (not on disk), since it gets
 *   forwarded straight to Cloudinary and never needs to persist locally.
 * - Restrict file size and accepted file types.
 *
 * Notes:
 * Two configured instances are exported: uploadImage (for banners,
 * leaders, album photos, achievement photos) and uploadPdf (for
 * Mandatory Disclosure documents and Transfer Certificates).
 * Using memory storage means req.file.buffer is what gets passed to
 * uploadToCloudinary — nothing is ever written to your server's disk.
 */

const imageFileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG and JPG/JPEG image files are allowed."), false);
  }
};

const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed."), false);
  }
};

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: imageFileFilter
});

export const uploadPdf = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: pdfFileFilter
});