import  { api, getApiErrorMessage, normalize } from './api';

/**
 * Enquiry Service
 *
 * Purpose:
 * Talks to the real backend's Enquiry endpoints.
 *
 * Notes:
 * - submitEnquiry() is a public endpoint used by the
 *   Contact Us form.
 * - All other methods require authentication.
 * - Enquiries use JSON requests.
 */

export const enquiryService = {
  async getEnquiries() {
    try {
      const response = await api.get("/enquiries");
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async submitEnquiry(data) {
    try {
      const response = await api.post("/public/enquiries", data);
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async updateEnquiryStatus(id, status) {
    try {
      const response = await api.patch(`/enquiries/${id}/status`, { status });
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },

  async deleteEnquiry(id) {
    try {
      const response = await api.delete(`/enquiries/${id}`);
      return normalize(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  },
};
