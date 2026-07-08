import mongoose from "mongoose";

/**
 * Album Model
 *
 * Purpose:
 * Represents a photo album shown on the public Gallery page, with
 * images embedded directly inside the album document.
 *
 * Responsibilities:
 * - Store album metadata (name, description, date, cover image).
 * - Store the album's photos as an embedded array of subdocuments.
 *
 * Notes:
 * Both Super Admin and Principal can manage galleries — no role
 * restriction applies here.
 * Images are embedded (not a separate collection) because every
 * screen that reads albums always needs the photos alongside the
 * album metadata at the same time — there's no use case here for
 * querying photos independently across albums. Each image gets its
 * own auto-generated _id from Mongoose, used to target a specific
 * photo for deletion.
 */
const albumSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500
        },
        // Optional. Can be set at creation or later via update — does
        // not need to be one of the images already in the array.
        coverImageUrl: {
            type: String,
            trim: true
        },
        coverImagePublicId: {
            type: String,
            trim: true
        },
        date: {
            type: Date,
            required: true
        },
        // Embedded photos. Defaults to an empty array so an album can be
        // created with zero photos and have them added afterward through
        // the dedicated addImageToAlbum endpoint.
        images: {
            type: [
                {
                    url: {
                        type: String,
                        required: true
                    },
                    publicId: {
                        type: String,
                        required: true
                    },
                    caption: {
                        type: String,
                        trim: true,
                        maxlength: 500
                    }
                }
            ],
            default: []
        }
    },
    {
        timestamps: true
    }
);

albumSchema.index({
    date: -1
});

const Album = mongoose.model("Album", albumSchema);

export default Album;