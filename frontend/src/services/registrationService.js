import  { api, getApiErrorMessage, normalize } from './api';

/**
 * Registration Service
 *
 * Purpose:
 * Talks to the real backend's Registration endpoints.
 *
 * Notes:
 * - submitRegistration() is a public endpoint used by the
 *   admission form on the school website.
 * - All other methods are admin-only.
 * - Registration requests use JSON (no file uploads).
 */

export const registrationService = {
  async getRegistrations() {
    try {
      const response = await api.get("/registrations");
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async submitRegistration(data) {
    try {
      const response = await api.post("/public/registrations", data);
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async updateRegistrationStatus(id, status) {
    try {
      const response = await api.patch(`/registrations/${id}/status`, { status });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async deleteRegistration(id) {
    try {
      const response = await api.delete(`/registrations/${id}`);
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async updateRegistration(id, data) {
    try {
      const response = await api.patch(`/registrations/${id}`, data);
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },
};
