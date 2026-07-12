import { api, getApiErrorMessage, normalize } from './api';

/**
 * Transfer Certificate Service
 *
 * Purpose:
 * Talks to the real backend's Transfer Certificate endpoints.
 *
 * Notes:
 * - addCertificate/updateCertificate expect FormData containing:
 *   - certificate (PDF)
 *   - admissionNumber
 *   - studentName
 *
 * - lookupCertificateByAdmissionNumber() uses the public lookup *endpoint.
 */

export const transferCertificateService = {
  async lookupCertificateByAdmissionNumber(admissionNumber) {
    try {
      const response = await api.get(`/transfer-certificates/lookup/${admissionNumber}`);
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async getCertificates() {
    try {
      const response = await api.get("/transfer-certificates");
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async addCertificate(formData) {
    try {
      const response = await api.post("/transfer-certificates", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async updateCertificate(tcId, formData) {
    try {
      const response = await api.patch(`/transfer-certificates/${tcId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async deleteCertificate(tcId) {
    try {
      const response = await api.delete(`/transfer-certificates/${tcId}`);
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  }
};
