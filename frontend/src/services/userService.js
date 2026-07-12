import { api, getApiErrorMessage, normalize } from './api';

/**
 * User Service
 *
 * Purpose:
 * Talks to the real backend's User Management endpoints.
 *
 * Notes:
 * - All endpoints require authentication.
 * - All endpoints are restricted to the Super Admin role.
 * - createuser() creates a new Principal account.
 * - updateUserStatus() enables or disables a Principal account.
 * - resetPassword() requires a newPassword value in the request body.
 * - All requests use JSON; no file uploads are involved.
 */

export const userService = {
  async getUsers() {
    try {
      const response = await api.get("/users");
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async createUser(data) {
    try {
      const response = await api.post("/users/principal", data);
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async updateUserStatus(id, status) {
    try {
      const response = await api.patch(`/users/${id}/toggle-status`, { status });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async resetPassword(id, newPassword) {
    try {
      const response = await api.patch(`/users/${id}/reset-password`, { newPassword });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async deleteUser(id) {
    try {
      const response = await api.delete(`/users/${id}`);
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },
};
