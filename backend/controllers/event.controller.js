import Event, { EVENT_CATEGORIES } from "../models/Event.model.js";
import { isValidObjectId } from "../utils/isValidObjectId.util.js";

/**
 * Event Controller
 *
 * Purpose:
 * Handles all CRUD operations for the school events calendar.
 *
 * Responsibilities:
 * - Create a new event.
 * - Fetch events (admin: all; public: same data, no auth), with
 *   optional category filtering via a ?category= query param.
 * - Update an existing event.
 * - Delete an event.
 *
 * Notes:
 * Both Super Admin and Principal can manage events.
 * No reorder endpoint exists here — events are always sorted by
 * date, not a manually managed order field.
 * Valid categories are defined once in Event.model.js (EVENT_CATEGORIES)
 * and imported here, so there is exactly one source of truth.
 */

/**
 * Shared internal helper — builds the events query with optional
 * category filtering, used by both getEvents and getPublicEvents
 * so the actual query logic exists in exactly one place.
 */
const fetchEvents = async (category) => {
  const filter = category ? { category } : {};
  return Event.find(filter).sort({ date: 1 });
};

/**
 * GET /api/events
 * Optional query param: ?category=sports
 * Admin-facing. Protected route.
 */
export const getEvents = async (req, res) => {
  try {
    const { category } = req.query;
    const events = await fetchEvents(category);
    return res.status(200).json({
      success: true,
      message: "Events retrieved successfully.",
      data: events
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

/**
 * GET /api/public/events
 * Optional query param: ?category=sports
 * Public-facing. No auth required.
 */
export const getPublicEvents = async (req, res) => {
  try {
    const { category } = req.query;
    const events = await fetchEvents(category);
    return res.status(200).json({
      success: true,
      message: "Events retrieved successfully.",
      data: events
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

/**
 * POST /api/events
 *
 * Creates a new event. venue and category are optional — category
 * falls back to the model's default ("general") if omitted.
 */
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, venue, category } = req.body;

    if (!title?.trim() || !description?.trim() || !date) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and date are required."
      });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid event date."
      });
    }

    if (category && !EVENT_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${EVENT_CATEGORIES.join(", ")}.`
      });
    }

    const event = await Event.create({
      title,
      description,
      date,
      time,
      venue,
      category
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully.",
      data: event
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

/**
 * PATCH /api/events/:id
 *
 * Updates an existing event. Each field is validated individually
 * before being applied, so a bad value in one field doesn't silently
 * skip validation just because other fields were valid.
 */
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event id."
      });
    }

    const { title, description, date, time, venue, category } = req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found."
      });
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty."
        });
      }
      event.title = title;
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Description cannot be empty."
        });
      }
      event.description = description;
    }

    if (date !== undefined) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid event date."
        });
      }
      event.date = date;
    }

    if (category !== undefined) {
      if (!EVENT_CATEGORIES.includes(category)) {
        return res.status(400).json({
          success: false,
          message: `Category must be one of: ${EVENT_CATEGORIES.join(", ")}.`
        });
      }
      event.category = category;
    }

    if (time !== undefined) event.time = time;
    if (venue !== undefined) event.venue = venue;

    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      data: event
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

/**
 * DELETE /api/events/:id
 */
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event id."
      });
    }

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};