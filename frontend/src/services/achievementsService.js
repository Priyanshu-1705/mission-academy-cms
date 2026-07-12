import { api, getApiErrorMessage, normalize } from './api';

/**
 * Achievement Service
 *
 * Purpose:
 * Talks to the real backend's Board Achiever and
 * Other Achievement endpoints.
 *
 * Notes:
 * - Board Achievers use FormData with an "image" file.
 * - Other Achievements use FormData with an "image" file.
 * - Image replacement is optional during updates.
 */

export const achievementsService = {
  async getPublicBoardAchievers() {
    try {
      const response = await api.get("/public/board-achievers");
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async getBoardAchievers() {
    try {
      const response = await api.get("/board-achievers");
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async addBoardAchiever(formData) {
    try {
      const response = await api.post("/board-achievers", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async updateBoardAchiever(id, formData) {
    try {
      const response = await api.patch(`/board-achievers/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async deleteBoardAchiever(id) {
    try {
      const response = await api.delete(`/board-achievers/${id}`);
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async getPublicOtherAchievements() {
    try {
      const response = await api.get("/public/other-achievements");
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async getOtherAchievements() {
    try {
      const response = await api.get("/other-achievements");
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async addOtherAchievement(formData) {
    try {
      const response = await api.post("/other-achievements", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async updateOtherAchievement(id, formData) {
    try {
      const response = await api.patch(`/other-achievements/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async deleteOtherAchievement(id) {
    try {
      const response = await api.delete(`/other-achievements/${id}`);
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async toggleOtherAchievementHomepage(id) {
    try {
      const response = await api.patch(`/other-achievements/${id}/toggle-homepage`);
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  }
};
