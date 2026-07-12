import { api, getApiErrorMessage, normalize } from "./api";

/**
 * Gallery Service
 *
 * Talks to Album endpoints.
 *
 * Notes:
 * - addAlbum/updateAlbum expect FormData containing
 *   coverImage (optional on update).
 *
 * - addImageToAlbum expects FormData containing
 *   image.
 *
 * - Public albums are fetched through
 *   /public/albums.
 */

export const galleryService = {
  async getPublicAlbums() {
    try {
      const response = await api.get("/public/albums");
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async getAlbums() {
    try {
      const response = await api.get("/albums");
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async addAlbum(formData) {
    try {
      const response = await api.post("/albums", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async deleteAlbum(albumId) {
    try {
      const response = await api.delete(`/albums/${albumId}`);
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async updateAlbum(albumId, formData) {
    try {
      const response = await api.patch(`/albums/${albumId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async addImageToAlbum(albumId, formData) {
    try {
      const response = await api.post(`/albums/${albumId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async deleteImageFromAlbum(albumId, imageId) {
    try {
      const response = await api.delete(
        `/albums/${albumId}/images/${imageId}`,
      );
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },
};
