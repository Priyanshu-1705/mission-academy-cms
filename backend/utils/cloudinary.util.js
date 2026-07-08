import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary Configuration & Helpers
 *
 * Purpose:
 * Centralizes Cloudinary setup and provides reusable upload/delete
 * functions used by every controller that manages an image or PDF.
 *
 * Responsibilities:
 * - Configure the Cloudinary SDK with credentials from .env.
 * - Upload a file buffer to Cloudinary and return its URL + public ID.
 * - Delete a file from Cloudinary by its public ID.
 *
 * Notes:
 * Every module that stores a file (Banner, Leader, Album images,
 * Achievements, Disclosure, Transfer Certificate) imports from here
 * rather than each writing its own Cloudinary logic — one place to
 * fix bugs or change upload behavior, not eight.
 */

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a file buffer (from multer's memory storage) to Cloudinary.
 *
 * @param {Buffer} fileBuffer - The raw file data from req.file.buffer
 * @param {string} folder - Cloudinary folder to organize uploads (e.g. "banners", "leaders")
 * @param {string} resourceType - "image" or "raw" (raw is used for PDFs)
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export const uploadToCloudinary = (fileBuffer, folder, resourceType = "image") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `mission-academy/${folder}`,
                resource_type: resourceType
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (!result) {
                    return reject(new Error("Cloudinary upload failed."));
                }
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id
                });
            }
        );

        uploadStream.end(fileBuffer);
    });
};

/**
 * Deletes a file from Cloudinary by its public ID.
 *
 * @param {string} publicId - The Cloudinary public ID to delete
 * @param {string} resourceType - "image" or "raw" (must match how it was uploaded)
 */
export const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

export default cloudinary;