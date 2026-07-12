import  { api, getApiErrorMessage, normalize } from './api';

/**
 * Settings Service
 *
 * Purpose:
 * Talks to the real backend's Settings endpoints.
 *
 * Notes:
 * - getPublicSettings() fetches the public settings used by the
 *   school website (footer, contact information, social links, etc.).
 * - getSettings() and updateSettings() are admin-only endpoints.
 * - Settings use JSON requests; no file uploads are involved.
 */

export const settingsService = {
  async getPublicSettings() {
    try {
      const response = await api.get("/public/settings");
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async getSettings() {
    try {
      const response = await api.get("/settings");
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async updateSettings(data) {
    try {
      const response = await api.patch("/settings", data);
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },
};
