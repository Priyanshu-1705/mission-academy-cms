import { api, getApiErrorMessage, normalize } from "./api";

/**
 * Banner Service
 *
 * Purpose:
 * Talks to the real backend's Banner endpoints.
 *
 * Notes:
 * addBanner/updateBanner now expect a real FormData object (containing
 * a File under the key "image", plus any other fields like "active"),
 * not a plain JSON object — the real backend route requires
 * multipart/form-data since it uploads the file to Cloudinary.
 */
export const bannerService = {
  async getPublicBanners() {
    try {
      const response = await api.get("/public/banners");
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },
  
  async getBanners() {
    try {
      const response = await api.get("/banners");
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async addBanner(formData) {
    try {
      const response = await api.post("/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async updateBanner(id, formData) {
    try {
      const response = await api.patch(`/banners/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async deleteBanner(id) {
    try {
      const response = await api.delete(`/banners/${id}`);
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async reorderBanners(id, direction) {
    try {
      const response = await api.patch(`/banners/${id}/reorder`, { direction });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  }
};