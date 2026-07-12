import { api, getApiErrorMessage, normalize } from "./api";

/**
 * Leadership Service
 *
 * Purpose:
 * Talks to the real backend's Leader endpoints.
 *
 * Notes:
 * addLeader/updateLeader expect FormData containing:
 * - photo (File)
 * - name
 * - designation
 * - message
 * Leadership Management is restricted to Super Admin only on the
 * backend (requireRole("super_admin")) — a Principal calling any of
 * the admin functions here will get a real 403 from the server.
 */

export const leadershipService = {
  async getPublicLeaders() {
    try {
      const response = await api.get("/public/leaders");
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async getLeaders() {
    try {
      const response = await api.get("/leaders");
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async addLeader(formData) {
    try {
      const response = await api.post("/leaders", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async updateLeader(id, formData) {
    try {
      const response = await api.patch(`/leaders/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async deleteLeader(id) {
    try {
      const response = await api.delete(`/leaders/${id}`);
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async reorderLeader(id, direction) {
    try {
      const response = await api.patch(`/leaders/${id}/reorder`, { direction });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  }
};