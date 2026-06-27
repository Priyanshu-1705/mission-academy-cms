import mongoose from "mongoose";

/**
 * Event Model
 *
 * Purpose:
 * Represents a single entry on the school events calendar.
 *
 * Responsibilities:
 * - Store event details (title, description, date, time, venue, category).
 *
 * Notes:
 * Both Super Admin and Principal can manage events — no role
 * restriction is applied at the route level for this module.
 * Unlike Banner/Leader, events have no manual "order" field — they
 * sort naturally by date, since chronological order is inherent to
 * what an event is, not an arbitrary admin choice.
 */

export const EVENT_CATEGORIES = ["academic", "sports", "cultural", "holiday", "general"]

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        },
        date: {
            type: Date,
            required: true
        },
        // Free-text timing, e.g. "08:30 AM - 12:00 PM". Optional —
        // some events (holidays) don't have a specific time.
        time: {
            type: String,
            trim: true
        },
        // Optional — not every event has a specific venue (e.g. a holiday).
        venue: {
            type: String,
            trim: true
        },
        category: {
            type: String,
            enum: EVENT_CATEGORIES,
            default: "general"
        }
    },
    {
        timestamps: true
    }
);

// Optimizes sorting and filtering events by date.
eventSchema.index({ date: 1 });

const Event = mongoose.model("Event", eventSchema);

export default Event;