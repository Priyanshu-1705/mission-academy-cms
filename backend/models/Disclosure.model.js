import mongoose from "mongoose";

/**
 * Disclosure Model
 *
 * Purpose:
 * Represents a single mandatory public disclosure document.
 *
 * Responsibilities:
 * - Store disclosure details (title, optional code, category).
 * - Store the public URL of the uploaded PDF.
 * - The actual file is stored on Cloudinary.
 * - Cloudinary public ID used when replacing or deleting
 * - the PDF so the storage stays clean.
 *
 * Notes:
 * Disclosures are always public.
 * Only the Super Admin can create, update, or delete disclosures.
 */

const disclosureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    documentCode: {
        type: String,
        trim: true,
        maxlength: 50
    },
    category: {
        type: String,
        required: true,
        enum: [
            "general_information",
            "documents_information",
            "results_academics",
            "staff_infrastructure"
        ]
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
    },
    displayOrder: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
})

disclosureSchema.index({
    category: 1,
    displayOrder: 1
});

const Disclosure = mongoose.model("Disclosure", disclosureSchema);

export default Disclosure;