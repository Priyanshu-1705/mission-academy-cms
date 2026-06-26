import mongoose from "mongoose";

/**
 * isValidObjectId
 *
 * Purpose:
 * Checks whether a given string is a structurally valid MongoDB
 * ObjectId, before it's used in a findById/findByIdAndUpdate/
 * findByIdAndDelete call.
 *
 * Responsibilities:
 * - Return true/false without throwing.
 *
 * Notes:
 * Used across every controller to return a clean 400 "invalid id"
 * response instead of letting Mongoose throw an uncaught CastError
 * that would otherwise surface as a generic 500.
 */
export const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};