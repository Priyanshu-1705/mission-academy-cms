import { api, getApiErrorMessage, normalize } from './api';

/**
 * Mandatory Disclosure Service
 *
 * Purpose:
 * Talks to the real backend's Disclosure endpoints.
 *
 * Notes:
 * - addDocument/updateDocument expect FormData containing:
 *   - document (PDF)
 *   - title
 *   - documentCode
 *   - category
 *   - displayOrder
 *
 * - Public documents are fetched through
 *   /public/disclosures.
 */

export const mandatoryDisclosureService = {
  async getPublicDocuments() {
    try {
      const response = await api.get("/public/disclosures");
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async getDocuments() {
    try {
      const response = await api.get("/disclosures");
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async addDocument(formData) {
    try {
      const response = await api.post("/disclosures", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async updateDocument(docId, formData) {
    try {
      const response = await api.patch(`/disclosures/${docId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async deleteDocument(docId) {
    try {
      const response = await api.delete(`/disclosures/${docId}`);
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },
};
