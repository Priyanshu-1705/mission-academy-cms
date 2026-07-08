import multer from "multer";

/**
 * Handle Upload Error Middleware
 *
 * Purpose:
 * Catches errors thrown by multer (file too large, wrong file type)
 * and converts them into the app's standard JSON error response,
 * instead of letting them crash as an unhandled exception.
 *
 * Notes:
 * multer's fileFilter and limits errors happen BEFORE a controller's
 * own try/catch ever runs, so they need their own dedicated handler.
 * Mount this immediately after any uploadImage/uploadPdf middleware
 * in a route definition.
 */
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.code === "LIMIT_FILE_SIZE" ? "File is too large." : err.message
    });
  }
  if (err instanceof Error) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
};