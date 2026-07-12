import { api, getApiErrorMessage, normalize } from './api';

/**
 * Event Service
 *
 * Purpose:
 * Talks to the real backend's Event endpoints.
 *
 * Notes:
 * Events use JSON requests — no multipart/form-data, since events
 * do not upload files.
 * getEvents/getPublicEvents accept an optional category parameter,
 * matching the backend's ?category= query filter. Passing "all" or
 * omitting the parameter returns every event, unfiltered.
 */

export const eventsService = {
  async getPublicEvents(category) {
    try {
      const params = category && category !== "all" ? { category } : {};
      const response = await api.get("/public/events", { params });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async getEvents(category) {
    try {
      const params = category && category !== "all" ? { category } : {};
      const response = await api.get("/events", { params });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async addEvent(data) {
    try {
      const response = await api.post("/events", data);
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async deleteEvent(eventId) {
    try {
      const response = await api.delete(`/events/${eventId}`);
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async updateEvent(eventId, data) {
    try {
      const response = await api.patch(`/events/${eventId}`, data);
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },
};
